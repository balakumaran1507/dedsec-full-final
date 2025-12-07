/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, CheckCircle, ExternalLink, AlertCircle, Loader2, X, Save, MapPin, Users, Trophy, Shield } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { CtfEvent, ChallengeDistribution } from "@/types/dashboard"
import { getCTFEvents, getUpcomingCTFEvents, getOngoingCTFEvents, getCompletedCTFEvents, createOrUpdateCTFEvent } from "@/lib/db/ctfEvents"
import { CTFEvent, CTFEventCreationData, CTFFormat, CTFDifficulty } from "@/types/ctf"
import { Timestamp } from "firebase/firestore"
import { AnimatePresence } from "framer-motion"
import { DedSecToast } from "@/components/ui/dedsec-toast"

interface ParticipationData {
  month: string;
  ctfs: number;
}

interface EnhancedCtfEvent extends CtfEvent {
  ctfData?: CTFEvent;
}

// Helper function to format dates
const formatEventDate = (date: Date | Timestamp): string => {
  const d = date instanceof Date ? date : date.toDate()
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatShortDate = (date: Date | Timestamp): string => {
  const d = date instanceof Date ? date : date.toDate()
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function OperationsPage() {
  const [selectedEvent, setSelectedEvent] = useState<EnhancedCtfEvent | null>(null)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState<EnhancedCtfEvent[]>([])
  const [ctfEventData, setCTFEventData] = useState<CTFEvent[]>([])
  const [participationData, setParticipationData] = useState<ParticipationData[]>([])
  const [statusData, setStatusData] = useState<ChallengeDistribution[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const handleSyncCTFTime = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch('/api/sync-ctftime', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Sync failed')
      }

      // Update last sync timestamp
      localStorage.setItem('ctftime_last_sync', new Date().getTime().toString())

      setToast({
        message: `SYNC COMPLETE\nCreated: ${data.created} | Updated: ${data.updated}`,
        type: "success"
      })

      // Reload events
      const allEvents = await getCTFEvents({ limit: 100 })
      setCTFEventData(allEvents)

      const dashboardEvents: EnhancedCtfEvent[] = allEvents.map(event => {
        const startDate = event.startDate && 'toDate' in event.startDate
          ? event.startDate.toDate()
          : event.startDate instanceof Date
            ? event.startDate
            : new Date()

        return {
          id: event.id,
          name: event.title,
          status: event.status === 'ongoing' ? 'live' : event.status === 'completed' ? 'complete' : 'upcoming',
          weight: event.weight.toString(),
          start: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          duration: event.duration ? event.duration.toString() : 'TBD',
          registered: false,
          result: event.status === 'completed' ? 'Completed' : undefined,
          ctfData: event
        }
      })
      setEvents(dashboardEvents)

      // Rebuild status distribution
      const statusDist: ChallengeDistribution[] = [
        { name: 'Live', value: dashboardEvents.filter(e => e.status === 'live').length, fill: '#10b981' },
        { name: 'Upcoming', value: dashboardEvents.filter(e => e.status === 'upcoming').length, fill: '#737373' },
        { name: 'Complete', value: dashboardEvents.filter(e => e.status === 'complete').length, fill: '#525252' }
      ].filter(item => item.value > 0)
      setStatusData(statusDist)
    } catch (error) {
      console.error('Failed to sync CTFTime:', error)
      setToast({
        message: "CONNECTION FAILED\nUnable to sync with CTFTime",
        type: "error"
      })
    } finally {
      setIsSyncing(false)
    }
  }
  const [newEvent, setNewEvent] = useState({
    title: '',
    url: '',
    weight: 25,
    format: 'Jeopardy' as CTFFormat,
    startDate: '',
    endDate: '',
    description: ''
  })

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.url || !newEvent.startDate || !newEvent.endDate) {
      alert('Please fill in all required fields')
      return
    }

    setIsCreating(true)
    try {
      const eventData: CTFEventCreationData = {
        ctftimeId: Date.now(), // Temporary ID for manually created events
        title: newEvent.title,
        description: newEvent.description,
        url: newEvent.url,
        ctftimeUrl: '',
        weight: newEvent.weight,
        format: newEvent.format,
        startDate: Timestamp.fromDate(new Date(newEvent.startDate)),
        endDate: Timestamp.fromDate(new Date(newEvent.endDate)),
        duration: Math.ceil((new Date(newEvent.endDate).getTime() - new Date(newEvent.startDate).getTime()) / (1000 * 60 * 60 * 24)),
        organizers: [],
        location: 'Online',
        restrictions: 'Open',
        difficulty: newEvent.weight >= 50 ? 'Hard' : newEvent.weight >= 25 ? 'Medium' : 'Easy',
        status: 'upcoming'
      }

      await createOrUpdateCTFEvent(eventData)
      setIsCreateModalOpen(false)

      // Reload events
      const allEvents = await getCTFEvents({ limit: 100 })
      setCTFEventData(allEvents)

      const dashboardEvents: EnhancedCtfEvent[] = allEvents.map(event => {
        const startDate = event.startDate && 'toDate' in event.startDate
          ? event.startDate.toDate()
          : event.startDate instanceof Date
            ? event.startDate
            : new Date()

        return {
          id: event.id,
          name: event.title,
          status: event.status === 'ongoing' ? 'live' : event.status === 'completed' ? 'complete' : 'upcoming',
          weight: event.weight.toString(),
          start: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          duration: event.duration ? event.duration.toString() : 'TBD',
          registered: false,
          result: event.status === 'completed' ? 'Completed' : undefined,
          ctfData: event
        }
      })
      setEvents(dashboardEvents)

      // Reset form
      setNewEvent({
        title: '',
        url: '',
        weight: 25,
        format: 'Jeopardy',
        startDate: '',
        endDate: '',
        description: ''
      })
    } catch (error) {
      console.error('Failed to create event:', error)
      alert('Failed to create event')
    } finally {
      setIsCreating(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Check if we should auto-sync (once per day)
        const lastSync = localStorage.getItem('ctftime_last_sync')
        const now = new Date().getTime()
        const oneDayInMs = 24 * 60 * 60 * 1000

        // Auto-sync if never synced or last sync was more than 24 hours ago
        if (!lastSync || (now - parseInt(lastSync)) > oneDayInMs) {
          console.log('🔄 Auto-syncing CTFtime events...')
          try {
            const response = await fetch('/api/sync-ctftime', { method: 'POST' })
            if (response.ok) {
              const data = await response.json()
              console.log(`✅ Auto-sync successful: ${data.created} created, ${data.updated} updated`)
              localStorage.setItem('ctftime_last_sync', now.toString())
            }
          } catch (syncError) {
            console.error('Auto-sync failed, continuing with cached data:', syncError)
          }
        }

        // Fetch all CTF events
        const allEvents = await getCTFEvents({ limit: 100 })
        setCTFEventData(allEvents)

        // Convert CTFEvent[] to EnhancedCtfEvent[] (dashboard type)
        const dashboardEvents: EnhancedCtfEvent[] = allEvents.map(event => {
          const startDate = event.startDate && 'toDate' in event.startDate
            ? event.startDate.toDate()
            : event.startDate instanceof Date
              ? event.startDate
              : new Date()

          const endDate = event.endDate && 'toDate' in event.endDate
            ? event.endDate.toDate()
            : event.endDate instanceof Date
              ? event.endDate
              : new Date()

          return {
            id: event.id,
            name: event.title,
            status: event.status === 'ongoing' ? 'live' : event.status === 'completed' ? 'complete' : 'upcoming',
            weight: event.weight.toString(),
            start: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            duration: event.duration ? event.duration.toString() : 'TBD',
            registered: false,
            result: event.status === 'completed' ? 'Completed' : undefined,
            ctfData: event
          }
        })

        setEvents(dashboardEvents)

        // Build participation data (group events by month)
        const monthlyData: { [key: string]: number } = {}
        allEvents.forEach(event => {
          const date = event.startDate && 'toDate' in event.startDate
            ? event.startDate.toDate()
            : event.startDate instanceof Date
              ? event.startDate
              : new Date()

          const monthKey = date.toLocaleDateString('en-US', { month: 'short' })
          monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
        })

        const participationChartData: ParticipationData[] = Object.entries(monthlyData).map(([month, ctfs]) => ({
          month,
          ctfs
        }))

        setParticipationData(participationChartData)

        // Build status distribution data
        const statusDist: ChallengeDistribution[] = [
          { name: 'Live', value: dashboardEvents.filter(e => e.status === 'live').length, fill: '#10b981' },
          { name: 'Upcoming', value: dashboardEvents.filter(e => e.status === 'upcoming').length, fill: '#737373' },
          { name: 'Complete', value: dashboardEvents.filter(e => e.status === 'complete').length, fill: '#525252' }
        ].filter(item => item.value > 0)

        setStatusData(statusDist)
      } catch (error) {
        console.error("Failed to load operations data", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredEvents = events.filter((e) => {
    if (activeTab === "all") return true
    if (activeTab === "upcoming") return e.status === "upcoming" || e.status === "live"
    return e.status === activeTab
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs text-neutral-500 tracking-widest">SYNCING OPERATIONS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg text-neutral-200 tracking-[0.2em]">EVENTS</h1>
          <p className="text-[10px] text-neutral-600 tracking-wider">CTF CALENDAR</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSyncCTFTime}
            disabled={isSyncing}
            className="bg-indigo-900 hover:bg-indigo-800 text-neutral-300 border border-indigo-800 text-xs tracking-wider"
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                SYNCING...
              </>
            ) : (
              'SYNC CTFTIME'
            )}
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs tracking-wider"
          >
            + ADD CTF
          </Button>
        </div>
      </div>

      <div className="flex gap-1 flex-wrap">
        {["upcoming", "live", "complete", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-[10px] tracking-wider rounded transition-colors ${activeTab === tab
              ? "bg-neutral-900 text-neutral-200 border border-neutral-800"
              : "text-neutral-600 hover:text-neutral-400"
              }`}
          >
            {tab.toUpperCase()}
            {tab !== 'all' && (
              <span className="ml-2 px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 text-[9px]">
                {tab === 'live' ? events.filter(e => e.status === 'live').length :
                  tab === 'upcoming' ? events.filter(e => e.status === 'upcoming').length :
                    events.filter(e => e.status === 'complete').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stats and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-3">
          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">LIVE</p>
                  <p className="text-xl text-neutral-100">{events.filter(e => e.status === 'live').length}</p>
                </div>
                <Calendar className="w-5 h-5 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">UPCOMING</p>
                  <p className="text-xl text-neutral-100">{events.filter(e => e.status === 'upcoming').length}</p>
                </div>
                <Clock className="w-5 h-5 text-neutral-600" />
              </div>
            </CardContent>
          </Card>


        </div>

        <Card className="lg:col-span-5 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">PARTICIPATION 2024</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-40 flex items-center justify-center" style={{ minHeight: '160px' }}>
              {participationData.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={participationData}>
                    <defs>
                      <linearGradient id="ctfGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#525252" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#525252" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} width={25} />
                    <Area type="monotone" dataKey="ctfs" stroke="#737373" fill="url(#ctfGrad)" strokeWidth={1} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-[10px] text-neutral-700 tracking-widest">NO PARTICIPATION DATA</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="lg:col-span-4 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">CTF DISTRIBUTION</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center gap-4 justify-center h-32" style={{ minHeight: '128px' }}>
              {statusData.length > 0 ? (
                <>
                  <div className="h-32 w-32" style={{ minHeight: '128px', minWidth: '128px' }}>
                    <ResponsiveContainer width={128} height={128}>
                      <PieChart>
                        <Pie data={statusData} innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value">
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2 text-[10px]">
                    {statusData.map((item) => (
                      <div key={item.name} className="flex justify-between">
                        <span className="text-neutral-600">{item.name.toUpperCase()}</span>
                        <span className="text-neutral-400">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-[10px] text-neutral-700 tracking-widest">NO DATA</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-neutral-950 border-neutral-900">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">CTF SCHEDULE</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-900">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((ctf) => (
                <div
                  key={ctf.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-neutral-900/30 transition-colors cursor-pointer gap-3"
                  onClick={() => setSelectedEvent(ctf)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-1.5 h-12 md:h-8 rounded-full ${ctf.status === "live"
                        ? "bg-emerald-600"
                        : ctf.status === "upcoming"
                          ? "bg-neutral-600"
                          : "bg-neutral-800"
                        }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-xs text-neutral-200 tracking-wider">{ctf.name}</div>
                        {ctf.ctfData?.difficulty && (
                          <span className={`px-2 py-0.5 rounded text-[9px] ${ctf.ctfData.difficulty === 'Hard' ? 'bg-red-900/30 text-red-400' :
                            ctf.ctfData.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                              'bg-green-900/30 text-green-400'
                            }`}>
                            {ctf.ctfData.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-neutral-600">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          {ctf.ctfData?.format || 'Unknown'}
                        </span>
                        {ctf.ctfData?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {ctf.ctfData.location}
                          </span>
                        )}
                        {ctf.ctfData?.organizers && ctf.ctfData.organizers.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {ctf.ctfData.organizers[0].name}
                            {ctf.ctfData.organizers.length > 1 && ` +${ctf.ctfData.organizers.length - 1}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 md:gap-6 text-[10px] ml-5 md:ml-0">
                    <div className="text-left md:text-right">
                      <div className="text-neutral-600">WEIGHT</div>
                      <div className="text-neutral-400">{ctf.weight}</div>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-neutral-600">START</div>
                      <div className="text-neutral-400">{ctf.start}</div>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-neutral-600">DURATION</div>
                      <div className="text-neutral-400">{ctf.duration} days</div>
                    </div>
                    {ctf.result && (
                      <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-[10px] rounded">{ctf.result}</span>
                    )}
                    {ctf.registered && !ctf.result && (
                      <span className="px-2 py-1 bg-emerald-900/30 text-emerald-500 text-[10px] rounded">REGISTERED</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[10px] text-neutral-700 tracking-widest">NO EVENTS FOUND</div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-950 border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-900">
              <div className="flex-1">
                <CardTitle className="text-base text-neutral-200 tracking-wider mb-2">{selectedEvent.name}</CardTitle>
                <div className="flex items-center gap-3 text-[10px] text-neutral-600">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    ID: {selectedEvent.id}
                  </span>
                  {selectedEvent.ctfData?.difficulty && (
                    <span className={`px-2 py-0.5 rounded ${selectedEvent.ctfData.difficulty === 'Hard' ? 'bg-red-900/30 text-red-400' :
                      selectedEvent.ctfData.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-green-900/30 text-green-400'
                      }`}>
                      {selectedEvent.ctfData.difficulty}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedEvent(null)}
                className="text-neutral-600 hover:text-neutral-300 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Description */}
              {selectedEvent.ctfData?.description && (
                <div className="pb-3 border-b border-neutral-900">
                  <p className="text-[10px] text-neutral-600 tracking-wider mb-2">DESCRIPTION</p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {selectedEvent.ctfData.description}
                  </p>
                </div>
              )}

              {/* Event Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px]">
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    STATUS
                  </p>
                  <span className={`inline-block px-2 py-1 rounded text-[10px] ${selectedEvent.status === 'live' ? 'bg-emerald-900/30 text-emerald-400' :
                    selectedEvent.status === 'upcoming' ? 'bg-neutral-800 text-neutral-300' :
                      'bg-neutral-900 text-neutral-500'
                    }`}>
                    {selectedEvent.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1 flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    WEIGHT
                  </p>
                  <p className="text-neutral-300">{selectedEvent.weight}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-neutral-600 tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    START DATE
                  </p>
                  <p className="text-neutral-300">
                    {selectedEvent.ctfData?.startDate ? formatEventDate(selectedEvent.ctfData.startDate) : selectedEvent.start}
                  </p>
                </div>
              </div>

              {/* Date Range Details */}
              {selectedEvent.ctfData && (
                <div className="grid grid-cols-2 gap-4 text-[10px] pt-2">
                  <div>
                    <p className="text-neutral-600 tracking-wider mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      END DATE
                    </p>
                    <p className="text-neutral-300">
                      {formatEventDate(selectedEvent.ctfData.endDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-600 tracking-wider mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      DURATION
                    </p>
                    <p className="text-neutral-300">{selectedEvent.duration} days</p>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              {selectedEvent.ctfData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] pt-2 border-t border-neutral-900">
                  <div>
                    <p className="text-neutral-600 tracking-wider mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      LOCATION
                    </p>
                    <p className="text-neutral-300">{selectedEvent.ctfData.location || 'Online'}</p>
                  </div>
                  <div>
                    <p className="text-neutral-600 tracking-wider mb-1 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      FORMAT
                    </p>
                    <p className="text-neutral-300">{selectedEvent.ctfData.format}</p>
                  </div>
                  <div>
                    <p className="text-neutral-600 tracking-wider mb-1 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      RESTRICTIONS
                    </p>
                    <p className="text-neutral-300">{selectedEvent.ctfData.restrictions || 'Open'}</p>
                  </div>
                  {selectedEvent.ctfData.organizers && selectedEvent.ctfData.organizers.length > 0 && (
                    <div>
                      <p className="text-neutral-600 tracking-wider mb-1 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        ORGANIZERS
                      </p>
                      <p className="text-neutral-300">
                        {selectedEvent.ctfData.organizers.map(org => org.name).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Interest Counter */}
              {selectedEvent.ctfData?.interestedMembers && (
                <div className="pt-3 border-t border-neutral-900">
                  <p className="text-[10px] text-neutral-600 tracking-wider mb-2 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    INTERESTED MEMBERS
                  </p>
                  <p className="text-sm text-neutral-300">
                    {selectedEvent.ctfData.interestedMembers.length} {selectedEvent.ctfData.interestedMembers.length === 1 ? 'member' : 'members'}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3">
                {selectedEvent.ctfData?.url && (
                  <Button
                    onClick={() => window.open(selectedEvent.ctfData?.url, '_blank')}
                    className="flex-1 bg-emerald-900 hover:bg-emerald-800 text-neutral-100 border border-emerald-800 text-[10px] tracking-wider h-9"
                  >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    VISIT EVENT
                  </Button>
                )}
                {selectedEvent.ctfData?.ctftimeUrl && (
                  <Button
                    onClick={() => window.open(selectedEvent.ctfData?.ctftimeUrl, '_blank')}
                    className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[10px] tracking-wider h-9"
                  >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    CTFTIME
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative w-full max-w-2xl mx-4 bg-neutral-950 border border-neutral-800 rounded p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-neutral-100 tracking-wider">CREATE CTF EVENT</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-500 tracking-wider mb-2">TITLE *</label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                  placeholder="CTF Name"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 tracking-wider mb-2">URL *</label>
                <Input
                  value={newEvent.url}
                  onChange={(e) => setNewEvent({ ...newEvent, url: e.target.value })}
                  className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                  placeholder="https://ctf.example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-500 tracking-wider mb-2">START DATE *</label>
                  <Input
                    type="datetime-local"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                    className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 tracking-wider mb-2">END DATE *</label>
                  <Input
                    type="datetime-local"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                    className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-500 tracking-wider mb-2">WEIGHT (0-100)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newEvent.weight}
                    onChange={(e) => setNewEvent({ ...newEvent, weight: parseInt(e.target.value) || 0 })}
                    className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 tracking-wider mb-2">FORMAT</label>
                  <select
                    value={newEvent.format}
                    onChange={(e) => setNewEvent({ ...newEvent, format: e.target.value as CTFFormat })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm rounded-md px-3 py-2"
                  >
                    <option value="Jeopardy">Jeopardy</option>
                    <option value="Attack-Defense">Attack-Defense</option>
                    <option value="Mixed">Mixed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-500 tracking-wider mb-2">DESCRIPTION</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full h-24 bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Event description..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-xs border-neutral-800 text-neutral-400 hover:bg-neutral-900 bg-transparent"
              >
                CANCEL
              </Button>
              <Button
                onClick={handleCreateEvent}
                disabled={isCreating}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    CREATING...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 mr-2" />
                    CREATE EVENT
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <DedSecToast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
