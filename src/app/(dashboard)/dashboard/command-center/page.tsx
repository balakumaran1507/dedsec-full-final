"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flag, Trophy, Users, Zap, Clock, Target, AlertTriangle } from "lucide-react"
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

export default function CommandCenterPage() {
  const solveRateData = [
    { time: "H1", solves: 2, attempts: 5 },
    { time: "H2", solves: 5, attempts: 12 },
    { time: "H3", solves: 8, attempts: 18 },
    { time: "H4", solves: 12, attempts: 24 },
    { time: "H5", solves: 15, attempts: 28 },
    { time: "H6", solves: 18, attempts: 31 },
    { time: "H7", solves: 21, attempts: 35 },
  ]

  const categoryData = [
    { name: "WEB", value: 75 },
    { name: "PWN", value: 60 },
    { name: "CRYPTO", value: 85 },
    { name: "REV", value: 45 },
    { name: "MISC", value: 90 },
    { name: "FORENSICS", value: 55 },
  ]

  const activityData = [
    { time: "1h", active: 4 },
    { time: "2h", active: 6 },
    { time: "3h", active: 5 },
    { time: "4h", active: 8 },
    { time: "5h", active: 7 },
    { time: "6h", active: 6 },
  ]

  const challengeDistribution = [
    { name: "Solved", value: 21, fill: "#525252" },
    { name: "Attempted", value: 8, fill: "#737373" },
    { name: "Untouched", value: 15, fill: "#404040" },
  ]

  const teamPerformance = [{ name: "Performance", value: 73, fill: "#525252" }]

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: "RANK", value: "#47", icon: Trophy, status: "normal" },
          { label: "POINTS", value: "2,847", icon: Flag, status: "normal" },
          { label: "SOLVES", value: "21/44", icon: Target, status: "normal" },
          { label: "TEAM", value: "8/12", icon: Users, status: "normal" },
          { label: "FIRST BLOODS", value: "3", icon: Zap, status: "clear" },
          { label: "TIME LEFT", value: "18:42", icon: Clock, status: "warning" },
        ].map((metric) => (
          <Card
            key={metric.label}
            className="bg-neutral-950 border-neutral-900 hover:border-neutral-800 transition-colors"
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="w-3.5 h-3.5 text-neutral-600" />
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    metric.status === "warning"
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
            <div className="h-40">
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
            </div>
            <div className="flex items-center gap-4 mt-2 text-[10px] text-neutral-600">
              <span className="flex items-center gap-1">
                <span className="w-2 h-px bg-neutral-500" /> SOLVES
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-px bg-neutral-600 border-dashed" /> ATTEMPTS
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">CATEGORY PROGRESS</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-40">
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
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">ACTIVE CTF SESSION</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex flex-col items-center">
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
                <span>HKCERT CTF 2024</span>
                <span>48H</span>
              </div>
              <div className="text-neutral-400">{"> SESSION :: ACTIVE"}</div>
              <div className="text-neutral-500">{"> FLAG_FORMAT: flag{...}"}</div>
              <div className="text-emerald-600">{"> CONNECTION STABLE"}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">TEAM ACTIVITY</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-32">
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
            </div>
            <div className="flex justify-between text-[10px] text-neutral-600 mt-2">
              <span>ONLINE: 6</span>
              <span>TOTAL: 12</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">CHALLENGE STATUS</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center gap-4">
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
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">TEAM PERFORMANCE</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center gap-4">
              <div className="h-32 w-32">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="60%"
                    outerRadius="100%"
                    data={teamPerformance}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar background={{ fill: "#1a1a1a" }} dataKey="value" cornerRadius={4} fill="#525252" />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                <div className="text-2xl text-neutral-200">47.7%</div>
                <div className="text-[10px] text-neutral-600">SOLVE RATE</div>
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">AVG TIME</span>
                    <span className="text-neutral-400">42min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">BEST</span>
                    <span className="text-neutral-400">8min</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-5 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">SOLVE FEED</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[
                { time: "14:23", event: "sp3c7r0 solved [WEB] SQLi Master", type: "success" },
                { time: "14:18", event: "n1ghtm4r3 solved [CRYPTO] RSA Weak", type: "success" },
                { time: "14:12", event: "ph4nt0m flagged [PWN] Stack Smash", type: "warning" },
                { time: "14:05", event: "gh0st solved [MISC] Hidden File", type: "success" },
                { time: "13:58", event: "d4rk0n3 first blood [REV] Keygen!", type: "info" },
                { time: "13:45", event: "cyb3rw01f attempting [FORENSICS]", type: "warning" },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-3 text-[10px] py-1.5 border-l border-neutral-800 pl-3">
                  <span className="text-neutral-700 shrink-0">{log.time}</span>
                  <span
                    className={`${
                      log.type === "warning"
                        ? "text-neutral-400"
                        : log.type === "info"
                          ? "text-emerald-600"
                          : "text-neutral-500"
                    }`}
                  >
                    {log.event}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">CHALLENGE GRID</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 44 }).map((_, i) => {
                const solved = i < 21
                const attempted = i >= 21 && i < 29
                return (
                  <div
                    key={i}
                    className={`w-full aspect-square rounded-sm ${
                      solved ? "bg-neutral-700" : attempted ? "bg-neutral-800" : "bg-neutral-900"
                    }`}
                    title={`Challenge ${i + 1}`}
                  />
                )
              })}
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
            {[
              { label: "GLOBAL RANK", value: "#47", trend: "+12" },
              { label: "TOTAL POINTS", value: "2,847", trend: "+450" },
              { label: "CTFTIME RATING", value: "89.4", trend: "+2.1" },
              { label: "COUNTRY RANK", value: "#3", trend: "—" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-600">{stat.label}</span>
                <div className="text-right">
                  <span className="text-xs text-neutral-300">{stat.value}</span>
                  <span
                    className={`text-[9px] ml-2 ${
                      stat.trend.startsWith("+") ? "text-emerald-600" : "text-neutral-500"
                    }`}
                  >
                    {stat.trend}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 p-3 bg-neutral-950 border border-neutral-900 rounded text-[10px]">
        <AlertTriangle className="w-3.5 h-3.5 text-neutral-600" />
        <span className="text-neutral-500">CTF STATUS: LIVE</span>
        <span className="text-neutral-700">|</span>
        <span className="text-neutral-600">NEXT FLAG CHECK: {new Date().toISOString().slice(11, 19)} UTC</span>
        <span className="ml-auto text-neutral-700">DEDSEC X01 // v1.0</span>
      </div>
    </div>
  )
}
