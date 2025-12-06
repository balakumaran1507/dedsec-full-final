/* eslint-disable */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flag, Trophy, Users, Zap, Clock, Target, AlertTriangle, Loader2 } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { SolveRateData, CategoryData, ActivityData, ChallengeDistribution, SolveLog, TeamStat } from "@/types/dashboard"
import { useAuth } from "@/lib/auth/useAuth"
import { getOngoingCTFEvents } from "@/lib/db/ctfEvents"
import { getAllUsers } from "@/lib/db/user"
import { CTFEvent } from "@/types/ctf"
import ActivityFeed from "@/components/dashboard/activity-feed"

export default function CommandCenterPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [solveRateData, setSolveRateData] = useState<SolveRateData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [challengeDistribution, setChallengeDistribution] = useState<ChallengeDistribution[]>([])
  const [solveLogs, setSolveLogs] = useState<SolveLog[]>([])
  const [teamStats, setTeamStats] = useState<TeamStat[]>([])
  const [ongoingEvents, setOngoingEvents] = useState<CTFEvent[]>([])
  const [totalTeamMembers, setTotalTeamMembers] = useState(0)
  const [ctftimeStats, setCtftimeStats] = useState<{
    teamName: string;
    currentRating: number;
    globalRank: string | number;
    country: string;
  } | null>(null)

  // Metrics state
  const [metrics, setMetrics] = useState({
    rank: "---",
    points: "---",
    solves: "0/0",
    team: "0/0",
    firstBloods: "0",
    timeLeft: "--:--"
  })

  const [activeSession, setActiveSession] = useState<{ name: string, duration: string } | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Fetch user stats and display them
        if (user) {
          setMetrics(prev => ({
            ...prev,
            rank: `#${user.rank}`,
            points: user.contributionScore.toString(),
            solves: `${user.stats.writeupCount}/---`
          }))
        }

        // Fetch ongoing CTF events
        const events = await getOngoingCTFEvents()
        setOngoingEvents(events)

        // Set active session if there's an ongoing event
        if (events.length > 0) {
          const event = events[0]
          const endDate = event.endDate && 'toDate' in event.endDate
            ? event.endDate.toDate()
            : event.endDate instanceof Date
              ? event.endDate
              : new Date()

          const now = new Date()
          const timeLeft = Math.max(0, endDate.getTime() - now.getTime())
          const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))

          setActiveSession({
            name: event.title,
            duration: `${hoursLeft}h remaining`
          })

          setMetrics(prev => ({
            ...prev,
            timeLeft: `${hoursLeft}:00`
          }))
        }

        // Fetch all team members
        const allUsers = await getAllUsers()
        setTotalTeamMembers(allUsers.length)
        setMetrics(prev => ({
          ...prev,
          team: `0/${allUsers.length}`
        }))

        // Build team stats
        const stats: TeamStat[] = [
          { label: "TOTAL MEMBERS", value: allUsers.length.toString(), trend: "+0" },
          { label: "ACTIVE EVENTS", value: events.length.toString(), trend: "+0" },
          { label: "TOTAL WRITEUPS", value: allUsers.reduce((sum, u) => sum + u.stats.writeupCount, 0).toString(), trend: "+0" }
        ]
        setTeamStats(stats)

        // Fetch CTFTime team stats
        try {
          const response = await fetch('/api/team-stats')
          if (response.ok) {
            const result = await response.json()
            if (result.success) {
              setCtftimeStats({
                teamName: result.data.teamName,
                currentRating: Number(result.data.currentRating) || 0,
                globalRank: result.data.globalRank,
                country: result.data.country
              })
            }
          }
        } catch (err) {
          console.warn('Failed to fetch CTFTime stats:', err)
        }

      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs text-neutral-500 tracking-widest">ESTABLISHING UPLINK...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: "RANK", value: metrics.rank, icon: Trophy, status: "normal" },
          { label: "POINTS", value: metrics.points, icon: Flag, status: "normal" },
          { label: "SOLVES", value: metrics.solves, icon: Target, status: "normal" },
          { label: "TEAM", value: metrics.team, icon: Users, status: "normal" },
          { label: "FIRST BLOODS", value: metrics.firstBloods, icon: Zap, status: "clear" },
          { label: "TIME LEFT", value: metrics.timeLeft, icon: Clock, status: "warning" },
        ].map((metric) => (
          <Card
            key={metric.label}
            className="bg-neutral-950 border-neutral-900 hover:border-neutral-800 transition-colors"
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="w-3.5 h-3.5 text-neutral-600" />
                <span
                  className={`w-1.5 h-1.5 rounded-full ${metric.status === "warning"
                    ? "bg-red-500"
                    : metric.status === "clear"
                      ? "bg-emerald-500"
                      : "bg-neutral-600"
                    }`}
                />
              </div>
              <p className="text-lg text-neutral-100 tracking-wider">{metric.value}</p>
              <p className="text-[10px] text-neutral-600 tracking-wider">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-5 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">SOLVE RATE</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-40 flex items-center justify-center">
              {solveRateData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={solveRateData}>
                    <defs>
                      <linearGradient id="solveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#525252" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#525252" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} width={30} />
                    <Area type="monotone" dataKey="solves" stroke="#737373" fill="url(#solveGrad)" strokeWidth={1} />
                    <Area
                      type="monotone"
                      dataKey="attempts"
                      stroke="#525252"
                      fill="transparent"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-[10px] text-neutral-700 tracking-widest">NO DATA AVAILABLE</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">CATEGORY PROGRESS</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-40 flex items-center justify-center">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <XAxis
                      type="number"
                      tick={{ fill: "#525252", fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "#525252", fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      width={50}
                    />
                    <Bar dataKey="value" fill="#525252" radius={[0, 2, 2, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-[10px] text-neutral-700 tracking-widest">NO DATA</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">ACTIVE CTF SESSION</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex flex-col items-center">
            {activeSession ? (
              <>
                <div className="relative w-28 h-28 mb-3">
                  <div className="absolute inset-0 border border-neutral-700 rounded-full opacity-60 animate-pulse" />
                  <div className="absolute inset-2 border border-neutral-800 rounded-full opacity-40" />
                  <div className="absolute inset-4 border border-neutral-800 rounded-full opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-px bg-neutral-700 opacity-30" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-px h-full bg-neutral-700 opacity-30" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-ping" />
                  </div>
                </div>

                <div className="text-[10px] text-neutral-600 space-y-1 w-full">
                  <div className="flex justify-between">
                    <span>{activeSession.name}</span>
                    <span>{activeSession.duration}</span>
                  </div>
                  <div className="text-neutral-400">{"> SESSION :: ACTIVE"}</div>
                  <div className="text-neutral-500">{"> FLAG_FORMAT: flag{...}"}</div>
                  <div className="text-emerald-600">{"> CONNECTION STABLE"}</div>
                </div>
              </>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-neutral-700 gap-2">
                <AlertTriangle className="w-6 h-6 opacity-20" />
                <span className="text-[10px] tracking-widest">NO ACTIVE SESSION</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">TEAM ACTIVITY</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-32 flex items-center justify-center">
              {activityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <XAxis dataKey="time" tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fill: "#525252", fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      width={25}
                      domain={[0, 12]}
                    />
                    <Line type="monotone" dataKey="active" stroke="#737373" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-[10px] text-neutral-700 tracking-widest">NO ACTIVITY</div>
              )}
            </div>
            <div className="flex justify-between text-[10px] text-neutral-600 mt-2">
              <span>ONLINE: {metrics.team.split('/')[0]}</span>
              <span>TOTAL: {metrics.team.split('/')[1]}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">CHALLENGE STATUS</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center gap-4 justify-center h-32">
              {challengeDistribution.length > 0 ? (
                <>
                  <div className="h-32 w-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={challengeDistribution}
                          innerRadius={35}
                          outerRadius={50}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {challengeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2 text-[10px]">
                    {challengeDistribution.map((item) => (
                      <div key={item.name} className="flex justify-between">
                        <span className="text-neutral-600">{item.name.toUpperCase()}</span>
                        <span className="text-neutral-400">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-[10px] text-neutral-700 tracking-widest">NO CHALLENGE DATA</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">TEAM PERFORMANCE</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center gap-4 justify-center h-32">
              <div className="text-[10px] text-neutral-700 tracking-widest">CALCULATING...</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-5 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">ACTIVITY FEED</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="max-h-48 overflow-y-auto">
              <ActivityFeed maxItems={8} showTitle={false} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">CHALLENGE GRID</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 44 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full aspect-square rounded-sm bg-neutral-900"
                  title={`Challenge ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-[10px] text-neutral-600">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-neutral-700 rounded-sm" /> SOLVED
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-neutral-800 rounded-sm" /> ATTEMPTING
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-neutral-900 rounded-sm" /> LOCKED
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">TEAM STATS</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {ctftimeStats && (
              <div className="mb-4 pb-3 border-b border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-emerald-500 tracking-wider">CTFTIME</span>
                  <a
                    href="https://ctftime.org/team/409848"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] text-neutral-600 hover:text-emerald-500 transition-colors"
                  >
                    VIEW →
                  </a>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-600">RATING</span>
                    <span className="text-xs text-neutral-300">{typeof ctftimeStats.currentRating === 'number' ? ctftimeStats.currentRating.toFixed(2) : ctftimeStats.currentRating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-600">RANK</span>
                    <span className="text-xs text-neutral-300">#{ctftimeStats.globalRank}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-600">COUNTRY</span>
                    <span className="text-xs text-neutral-300">{ctftimeStats.country}</span>
                  </div>
                </div>
              </div>
            )}
            {teamStats.length > 0 ? (
              teamStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-600">{stat.label}</span>
                  <div className="text-right">
                    <span className="text-xs text-neutral-300">{stat.value}</span>
                    <span
                      className={`text-[9px] ml-2 ${stat.trend.startsWith("+") ? "text-emerald-600" : "text-neutral-500"
                        }`}
                    >
                      {stat.trend}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-[10px] text-neutral-700 tracking-widest">NO STATS</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 p-3 bg-neutral-950 border border-neutral-900 rounded text-[10px]">
        <AlertTriangle className="w-3.5 h-3.5 text-neutral-600" />
        <span className="text-neutral-500">CTF STATUS: {activeSession ? "LIVE" : "STANDBY"}</span>
        <span className="text-neutral-700">|</span>
        <span className="text-neutral-600">NEXT FLAG CHECK: {new Date().toISOString().slice(11, 19)} UTC</span>
        <span className="ml-auto text-neutral-700">DEDSEC X01 // v1.0</span>
      </div>
    </div>
  )
}
