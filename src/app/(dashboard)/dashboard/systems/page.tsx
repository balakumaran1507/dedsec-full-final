"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Globe, Flag, TrendingUp, ExternalLink, Medal } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, RadialBarChart, RadialBar, BarChart, Bar } from "recharts"

export default function SystemsPage() {
  const [selectedTeam, setSelectedTeam] = useState<any>(null)

  const teams = [
    { rank: 1, name: "perfect r00t", country: "KR", rating: 892.45, ctfs: 89, points: 4521 },
    { rank: 2, name: "Blue Water", country: "US", rating: 845.12, ctfs: 76, points: 4102 },
    { rank: 3, name: "Plaid Parliament", country: "US", rating: 823.67, ctfs: 82, points: 3987 },
    { rank: 47, name: "DEDSEC X01", country: "HK", rating: 89.4, ctfs: 31, points: 847, highlight: true },
    { rank: 48, name: "CyberHunters", country: "DE", rating: 87.23, ctfs: 28, points: 812 },
    { rank: 49, name: "NightOwls", country: "JP", rating: 85.91, ctfs: 35, points: 798 },
  ]

  const ratingHistory = [
    { month: "JAN", rating: 45.2 },
    { month: "FEB", rating: 52.8 },
    { month: "MAR", rating: 61.4 },
    { month: "APR", rating: 68.9 },
    { month: "MAY", rating: 78.3 },
    { month: "JUN", rating: 89.4 },
  ]

  const performanceData = [{ name: "Rating", value: 89, fill: "#525252" }]

  const categoryPerformance = [
    { cat: "WEB", score: 85 },
    { cat: "PWN", score: 72 },
    { cat: "CRYPTO", score: 91 },
    { cat: "REV", score: 68 },
    { cat: "MISC", score: 78 },
  ]

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg text-neutral-200 tracking-[0.2em]">RANKINGS</h1>
          <p className="text-[10px] text-neutral-600 tracking-wider">CTFTIME LEADERBOARD</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs tracking-wider">
            <ExternalLink className="w-3 h-3 mr-2" />
            CTFTIME
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-neutral-950 border-neutral-900">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-600 tracking-wider">GLOBAL RANK</p>
                <p className="text-xl text-neutral-100">#47</p>
              </div>
              <Trophy className="w-5 h-5 text-neutral-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-950 border-neutral-900">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-600 tracking-wider">COUNTRY</p>
                <p className="text-xl text-neutral-100">#3</p>
              </div>
              <Globe className="w-5 h-5 text-neutral-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-950 border-neutral-900">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-600 tracking-wider">RATING</p>
                <p className="text-xl text-neutral-100">89.40</p>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-950 border-neutral-900">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-600 tracking-wider">POINTS 2024</p>
                <p className="text-xl text-neutral-100">847</p>
              </div>
              <Flag className="w-5 h-5 text-neutral-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-5 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">RATING HISTORY</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratingHistory}>
                  <XAxis dataKey="month" tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: "#525252", fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                    width={35}
                    domain={[0, 100]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#737373"
                    strokeWidth={1.5}
                    dot={{ fill: "#525252", r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-[10px] text-emerald-600 mt-2">+44.2 THIS YEAR</div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">PERCENTILE</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex flex-col items-center">
            <div className="h-28 w-28">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="70%"
                  outerRadius="100%"
                  data={performanceData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar background={{ fill: "#1a1a1a" }} dataKey="value" cornerRadius={4} fill="#525252" />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-2xl text-neutral-200 -mt-4">TOP 5%</div>
            <div className="text-[10px] text-neutral-600">GLOBAL</div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">CATEGORY STRENGTH</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryPerformance}>
                  <XAxis dataKey="cat" tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: "#525252", fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                    width={25}
                    domain={[0, 100]}
                  />
                  <Bar dataKey="score" fill="#525252" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-neutral-950 border-neutral-900">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">GLOBAL LEADERBOARD</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-900">
                  <th className="text-left py-2 px-4 text-[10px] text-neutral-600 tracking-wider">RANK</th>
                  <th className="text-left py-2 px-4 text-[10px] text-neutral-600 tracking-wider">TEAM</th>
                  <th className="text-left py-2 px-4 text-[10px] text-neutral-600 tracking-wider">COUNTRY</th>
                  <th className="text-left py-2 px-4 text-[10px] text-neutral-600 tracking-wider">RATING</th>
                  <th className="text-left py-2 px-4 text-[10px] text-neutral-600 tracking-wider">CTFS</th>
                  <th className="text-left py-2 px-4 text-[10px] text-neutral-600 tracking-wider">POINTS</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr
                    key={team.rank}
                    className={`border-b border-neutral-900/50 transition-colors cursor-pointer ${
                      team.highlight ? "bg-neutral-900/50" : "hover:bg-neutral-900/30"
                    }`}
                    onClick={() => setSelectedTeam(team)}
                  >
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        {team.rank <= 3 && <Medal className="w-3 h-3 text-neutral-500" />}
                        <span className="text-[10px] text-neutral-400">#{team.rank}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-xs text-neutral-200 tracking-wider">
                      {team.name}
                      {team.highlight && <span className="ml-2 text-[9px] text-emerald-600">(YOU)</span>}
                    </td>
                    <td className="py-2 px-4 text-[10px] text-neutral-500">{team.country}</td>
                    <td className="py-2 px-4 text-[10px] text-neutral-300">{team.rating}</td>
                    <td className="py-2 px-4 text-[10px] text-neutral-500">{team.ctfs}</td>
                    <td className="py-2 px-4 text-[10px] text-neutral-400">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedTeam && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-950 border-neutral-800 w-full max-w-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm text-neutral-200 tracking-wider">{selectedTeam.name}</CardTitle>
                <p className="text-[10px] text-neutral-600">RANK #{selectedTeam.rank}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedTeam(null)}
                className="text-neutral-600 hover:text-neutral-300 h-6 w-6 p-0"
              >
                x
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-[10px]">
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">COUNTRY</p>
                  <p className="text-neutral-300">{selectedTeam.country}</p>
                </div>
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">RATING</p>
                  <p className="text-neutral-300">{selectedTeam.rating}</p>
                </div>
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">CTFS PLAYED</p>
                  <p className="text-neutral-300">{selectedTeam.ctfs}</p>
                </div>
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">POINTS 2024</p>
                  <p className="text-neutral-300">{selectedTeam.points}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[10px] tracking-wider h-8">
                  VIEW PROFILE
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
