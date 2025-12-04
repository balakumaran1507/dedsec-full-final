/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Trophy, Globe, Target, TrendingUp, Loader2 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { TeamRanking } from "@/types/dashboard"

interface PerformanceData {
  month: string;
  rank: number;
}

export default function SystemsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [rankings, setRankings] = useState<TeamRanking[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        // setRankings([])
        // setPerformanceData([])
      } catch (error) {
        console.error("Failed to load systems data", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredRankings = rankings.filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs text-neutral-500 tracking-widest">CALCULATING GLOBAL STANDINGS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg text-neutral-200 tracking-[0.2em]">RANKINGS</h1>
          <p className="text-[10px] text-neutral-600 tracking-wider">GLOBAL LEADERBOARD</p>
        </div>
        <Button className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs tracking-wider">
          UPDATE STATS
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-3">
          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">GLOBAL RANK</p>
                  <p className="text-xl text-neutral-100">#--</p>
                </div>
                <Globe className="w-5 h-5 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">COUNTRY RANK</p>
                  <p className="text-xl text-neutral-100">#--</p>
                </div>
                <Trophy className="w-5 h-5 text-neutral-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">RATING</p>
                  <p className="text-xl text-neutral-100">--</p>
                </div>
                <Target className="w-5 h-5 text-neutral-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">TREND</p>
                  <p className="text-xl text-emerald-500">--</p>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-9 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">PERFORMANCE HISTORY</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-64 flex items-center justify-center">
              {performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <XAxis dataKey="month" tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis
                      reversed
                      tick={{ fill: "#525252", fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      width={30}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#171717",
                        border: "1px solid #262626",
                        fontSize: "10px",
                        color: "#d4d4d4",
                      }}
                      itemStyle={{ color: "#d4d4d4" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rank"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981", r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-[10px] text-neutral-700 tracking-widest">NO PERFORMANCE DATA</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-neutral-950 border-neutral-900">
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">TOP TEAMS</CardTitle>
            <div className="relative w-48">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-neutral-600" />
              <Input
                placeholder="SEARCH TEAMS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-7 bg-neutral-900 border-neutral-800 text-neutral-300 placeholder-neutral-700 text-[10px] tracking-wider"
              />
            </div>
          </div>
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
                {filteredRankings.length > 0 ? (
                  filteredRankings.map((team) => (
                    <tr
                      key={team.rank}
                      className={`border-b border-neutral-900/50 hover:bg-neutral-900/30 transition-colors ${team.highlight ? "bg-emerald-950/10" : ""
                        }`}
                    >
                      <td className="py-2 px-4">
                        <span
                          className={`text-xs font-mono ${team.highlight ? "text-emerald-500" : "text-neutral-500"}`}
                        >
                          #{team.rank}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span className={`text-xs tracking-wider ${team.highlight ? "text-emerald-400" : "text-neutral-300"}`}>
                          {team.name}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-[10px] text-neutral-500">{team.country}</td>
                      <td className="py-2 px-4 text-[10px] text-neutral-400">{team.rating.toFixed(2)}</td>
                      <td className="py-2 px-4 text-[10px] text-neutral-600">{team.ctfs}</td>
                      <td className="py-2 px-4 text-[10px] text-neutral-400">{team.points}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[10px] text-neutral-700 tracking-widest">
                      NO RANKINGS AVAILABLE
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
