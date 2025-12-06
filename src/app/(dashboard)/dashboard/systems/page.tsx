/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Trophy, Globe, Target, TrendingUp, Loader2, Award, BookOpen, ThumbsUp, Flag } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { TeamRanking } from "@/types/dashboard"
import { getTopContributors, recalculateAllRanks } from "@/lib/db/user"
import { useAuth } from "@/lib/auth/useAuth"
import { fetchTeamInfo } from "@/lib/api/ctftimeTeam"

interface PerformanceData {
  year: string;
  rank: number;
}

interface EnhancedRanking extends TeamRanking {
  writeups: number;
  upvotes: number;
}

export default function SystemsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [rankings, setRankings] = useState<EnhancedRanking[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  const loadRankings = async () => {
    setIsLoading(true)
    try {
      // Fetch top contributors (leaderboard)
      const topUsers = await getTopContributors(50)

      // Convert to TeamRanking format with detailed stats
      const teamRankings: any[] = topUsers.map((u, index) => ({
        rank: u.rank,
        name: u.displayName,
        country: 'Global', // Could be added to user profile later
        rating: u.contributionScore,
        ctfs: u.stats.ctfParticipation || 0,
        writeups: u.stats.writeupCount || 0,
        upvotes: u.stats.totalUpvotes || 0,
        points: u.contributionScore,
        highlight: user?.uid === u.uid // Highlight current user
      }))

      setRankings(teamRankings)

      // Fetch CTFtime team performance history
      try {
        const teamData = await fetchTeamInfo()
        if (teamData && teamData.rating) {
          // Build performance history from CTFtime ratings
          const historyData: PerformanceData[] = []

          // Get years with rating data and sort them
          const rating: Record<string, any> = teamData.rating as Record<string, any>
          const years = Object.keys(rating)
            .filter(year => rating[year]?.country_place)
            .sort((a, b) => parseInt(a) - parseInt(b))

          // Take last 10 years max
          const recentYears = years.slice(-10)

          recentYears.forEach(year => {
            const yearData = rating[year]
            if (yearData?.country_place) {
              historyData.push({
                year: year,
                rank: yearData.country_place
              })
            }
          })

          setPerformanceData(historyData)
        }
      } catch (ctfError) {
        console.warn('Failed to fetch CTFtime team data:', ctfError)
      }
    } catch (error) {
      console.error("Failed to load systems data", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRankings()
  }, [user])

  const handleUpdateStats = async () => {
    setIsUpdating(true)
    try {
      await recalculateAllRanks()
      await loadRankings()
    } catch (error) {
      console.error('Failed to update stats:', error)
    } finally {
      setIsUpdating(false)
    }
  }

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
        <Button
          onClick={handleUpdateStats}
          disabled={isUpdating}
          className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs tracking-wider"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              UPDATING...
            </>
          ) : (
            'UPDATE STATS'
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-3">
          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">GLOBAL RANK</p>
                  <p className="text-xl text-neutral-100">#{user?.rank || '--'}</p>
                </div>
                <Globe className="w-5 h-5 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">TOTAL MEMBERS</p>
                  <p className="text-xl text-neutral-100">{rankings.length}</p>
                </div>
                <Trophy className="w-5 h-5 text-neutral-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">CONTRIBUTION</p>
                  <p className="text-xl text-neutral-100">{user?.contributionScore || '--'}</p>
                </div>
                <Target className="w-5 h-5 text-neutral-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-600 tracking-wider">HEX TITLE</p>
                  <p className="text-sm text-emerald-500 font-mono">{user?.title || '--'}</p>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-9 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">CTFTIME TEAM PERFORMANCE (INDIA)</CardTitle>
              <span className="text-[9px] text-neutral-600 tracking-wider">COUNTRY RANK OVER YEARS</span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-64 flex items-center justify-center">
              {performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <XAxis dataKey="year" tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis
                      reversed
                      tick={{ fill: "#525252", fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      width={30}
                      label={{ value: 'Rank', angle: -90, position: 'insideLeft', style: { fill: '#525252', fontSize: 9 } }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#171717",
                        border: "1px solid #262626",
                        fontSize: "10px",
                        color: "#d4d4d4",
                      }}
                      itemStyle={{ color: "#d4d4d4" }}
                      formatter={(value: number) => [`#${value}`, 'Country Rank']}
                    />
                    <Line
                      type="monotone"
                      dataKey="rank"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center">
                  <Loader2 className="w-6 h-6 text-neutral-700 animate-spin mx-auto mb-2" />
                  <div className="text-[10px] text-neutral-700 tracking-widest">LOADING CTFTIME DATA...</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-neutral-950 border-neutral-900">
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">INTERNAL LEADERBOARD</CardTitle>
              <p className="text-[9px] text-neutral-600 tracking-wider mt-1">
                Based on Writeups (50pts) + CTF Participation (30pts) + Upvotes (10pts)
              </p>
            </div>
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-neutral-600" />
              <Input
                placeholder="SEARCH MEMBERS..."
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
                  <th className="text-left py-2 px-4 text-[10px] text-neutral-600 tracking-wider">MEMBER</th>
                  <th className="text-center py-2 px-4 text-[10px] text-neutral-600 tracking-wider">
                    <div className="flex items-center justify-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>WRITEUPS</span>
                    </div>
                  </th>
                  <th className="text-center py-2 px-4 text-[10px] text-neutral-600 tracking-wider">
                    <div className="flex items-center justify-center gap-1">
                      <Flag className="w-3 h-3" />
                      <span>CTFs</span>
                    </div>
                  </th>
                  <th className="text-center py-2 px-4 text-[10px] text-neutral-600 tracking-wider">
                    <div className="flex items-center justify-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>UPVOTES</span>
                    </div>
                  </th>
                  <th className="text-center py-2 px-4 text-[10px] text-neutral-600 tracking-wider">
                    <div className="flex items-center justify-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>SCORE</span>
                    </div>
                  </th>
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
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-mono ${team.highlight ? "text-emerald-500" : "text-neutral-500"}`}
                          >
                            #{team.rank}
                          </span>
                          {team.rank <= 3 && (
                            <Trophy className={`w-3 h-3 ${team.rank === 1 ? 'text-yellow-500' :
                                team.rank === 2 ? 'text-gray-400' :
                                  'text-orange-600'
                              }`} />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs tracking-wider ${team.highlight ? "text-emerald-400 font-semibold" : "text-neutral-300"}`}>
                          {team.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] text-neutral-400">{team.writeups || 0}</span>
                        <span className="text-[9px] text-neutral-600 ml-1">({(team.writeups || 0) * 50}pts)</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] text-neutral-400">{team.ctfs || 0}</span>
                        <span className="text-[9px] text-neutral-600 ml-1">({(team.ctfs || 0) * 30}pts)</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] text-neutral-400">{team.upvotes || 0}</span>
                        <span className="text-[9px] text-neutral-600 ml-1">({(team.upvotes || 0) * 10}pts)</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs font-mono ${team.highlight ? "text-emerald-400 font-bold" : "text-neutral-300"}`}>
                          {team.points}
                        </span>
                      </td>
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
