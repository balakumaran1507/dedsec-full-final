/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, CheckCircle, ExternalLink, AlertCircle, Loader2 } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { CtfEvent, ChallengeDistribution } from "@/types/dashboard"

interface ParticipationData {
  month: string;
  ctfs: number;
}

export default function OperationsPage() {
  const [selectedEvent, setSelectedEvent] = useState<CtfEvent | null>(null)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState<CtfEvent[]>([])
  const [participationData, setParticipationData] = useState<ParticipationData[]>([])
  const [statusData, setStatusData] = useState<ChallengeDistribution[]>([])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        // setEvents([])
        // setParticipationData([])
        // setStatusData([])
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
        <Button className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs tracking-wider">
          + ADD CTF
        </Button>
      </div>

      <div className="flex gap-1">
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

          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">COMPLETED</p>
                  <p className="text-xl text-neutral-100">{events.filter(e => e.status === 'complete').length}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-neutral-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">AVG RANK</p>
                  <p className="text-xl text-neutral-100">--</p>
                </div>
                <AlertCircle className="w-5 h-5 text-neutral-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-5 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">PARTICIPATION 2024</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-40 flex items-center justify-center">
              {participationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
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
            <div className="flex items-center gap-4 justify-center h-32">
              {statusData.length > 0 ? (
                <>
                  <div className="h-32 w-32">
                    <ResponsiveContainer width="100%" height="100%">
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
                  className="flex items-center justify-between p-4 hover:bg-neutral-900/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedEvent(ctf)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-1.5 h-8 rounded-full ${ctf.status === "live"
                        ? "bg-emerald-600"
                        : ctf.status === "upcoming"
                          ? "bg-neutral-600"
                          : "bg-neutral-800"
                        }`}
                    />
                    <div>
                      <div className="text-xs text-neutral-200 tracking-wider">{ctf.name}</div>
                      <div className="text-[10px] text-neutral-600">{ctf.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-[10px]">
                    <div className="text-right">
                      <div className="text-neutral-600">WEIGHT</div>
                      <div className="text-neutral-400">{ctf.weight}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-neutral-600">START</div>
                      <div className="text-neutral-400">{ctf.start}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-neutral-600">DURATION</div>
                      <div className="text-neutral-400">{ctf.duration}</div>
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
          <Card className="bg-neutral-950 border-neutral-800 w-full max-w-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm text-neutral-200 tracking-wider">{selectedEvent.name}</CardTitle>
                <p className="text-[10px] text-neutral-600">{selectedEvent.id}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedEvent(null)}
                className="text-neutral-600 hover:text-neutral-300 h-6 w-6 p-0"
              >
                x
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-[10px]">
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">STATUS</p>
                  <p className="text-neutral-300 uppercase">{selectedEvent.status}</p>
                </div>
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">WEIGHT</p>
                  <p className="text-neutral-300">{selectedEvent.weight}</p>
                </div>
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">START</p>
                  <p className="text-neutral-300">{selectedEvent.start}</p>
                </div>
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">DURATION</p>
                  <p className="text-neutral-300">{selectedEvent.duration}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[10px] tracking-wider h-8">
                  {selectedEvent.registered ? "VIEW CHALLENGES" : "REGISTER"}
                </Button>
                <Button className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[10px] tracking-wider h-8">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  CTFTIME
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
