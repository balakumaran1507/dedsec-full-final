/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Trophy, Flag, Target, Clock, Award, TrendingUp, Edit2, Loader2 } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { SolveHistoryData, CategoryData, DifficultyStat, RecentSolve, Badge } from "@/types/dashboard"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [solveHistory, setSolveHistory] = useState<SolveHistoryData[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryData[]>([])
  const [difficultyBreakdown, setDifficultyBreakdown] = useState<DifficultyStat[]>([])
  const [recentSolves, setRecentSolves] = useState<RecentSolve[]>([])
  const [badges, setBadges] = useState<Badge[]>([])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        // TODO: Fetch real data from API/Firebase
        // setSolveHistory([])
        // setCategoryStats([])
        // setDifficultyBreakdown([])
        // setRecentSolves([])
        // setBadges([])
      } catch (error) {
        console.error("Failed to load profile data", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs text-neutral-500 tracking-widest">LOADING OPERATOR PROFILE...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Profile Header */}
      <div className="flex items-start gap-6 p-4 bg-neutral-950 border border-neutral-900 rounded">
        <div className="relative">
          <div className="w-20 h-20 bg-neutral-900 rounded border border-neutral-800 flex items-center justify-center">
            <span className="text-2xl text-neutral-500">OP</span>
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-neutral-950 rounded-full" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl text-neutral-100 tracking-wider">OPERATOR</h2>
            <span className="text-[10px] px-2 py-0.5 bg-red-950/50 text-red-500 rounded border border-red-900/50">
              CAPTAIN
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">@sp3c7r0 // Web Security Specialist</p>
          <div className="flex items-center gap-4 mt-3 text-[10px] text-neutral-500">
            <span>JOINED: MAR 2023</span>
            <span>|</span>
            <span>CTFS: 24</span>
            <span>|</span>
            <span>RANK: #47 GLOBAL</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-neutral-800 text-neutral-400 hover:bg-neutral-900 bg-transparent"
        >
          <Edit2 className="w-3 h-3 mr-2" />
          EDIT
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "TOTAL SOLVES", value: "0", icon: Flag },
          { label: "TOTAL POINTS", value: "0", icon: Trophy },
          { label: "AVG SOLVE TIME", value: "--", icon: Clock },
          { label: "FIRST BLOODS", value: "0", icon: Target },
          { label: "WIN RATE", value: "--%", icon: TrendingUp },
        ].map((stat) => (
          <Card key={stat.label} className="bg-neutral-950 border-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-3.5 h-3.5 text-neutral-600" />
              </div>
              <p className="text-lg text-neutral-100 tracking-wider">{stat.value}</p>
              <p className="text-[10px] text-neutral-600 tracking-wider">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Solve History Chart */}
        <Card className="lg:col-span-5 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">SOLVE HISTORY</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-40 flex items-center justify-center">
              {solveHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={solveHistory}>
                    <XAxis dataKey="month" tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} width={25} />
                    <Line
                      type="monotone"
                      dataKey="solves"
                      stroke="#737373"
                      strokeWidth={1.5}
                      dot={{ fill: "#525252", r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-[10px] text-neutral-700 tracking-widest">NO HISTORY DATA</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="lg:col-span-4 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">CATEGORY BREAKDOWN</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center gap-4 justify-center h-32">
              {categoryStats.length > 0 ? (
                <>
                  <div className="h-32 w-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categoryStats} innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value">
                          {categoryStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-1.5 text-[10px]">
                    {categoryStats.map((cat) => (
                      <div key={cat.name} className="flex justify-between items-center">
                        <span className="text-neutral-600">{cat.name}</span>
                        <span className="text-neutral-400">{cat.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-[10px] text-neutral-700 tracking-widest">NO CATEGORY DATA</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Breakdown */}
        <Card className="lg:col-span-3 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">DIFFICULTY</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-32 flex items-center justify-center">
              {difficultyBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={difficultyBreakdown}>
                    <XAxis dataKey="name" tick={{ fill: "#525252", fontSize: 8 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} width={20} />
                    <Bar dataKey="count" fill="#525252" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-[10px] text-neutral-700 tracking-widest">NO DATA</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Solves */}
        <Card className="lg:col-span-6 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">RECENT SOLVES</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {recentSolves.length > 0 ? (
                recentSolves.map((solve, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-neutral-900 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Flag className="w-3.5 h-3.5 text-neutral-700" />
                      <div>
                        <div className="text-xs text-neutral-300">{solve.name}</div>
                        <div className="text-[10px] text-neutral-600">{solve.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-neutral-400">{solve.points} pts</div>
                      <div className="text-[10px] text-neutral-700">{solve.time}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-[10px] text-neutral-700 tracking-widest">NO RECENT SOLVES</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="lg:col-span-6 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">BADGES</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-3 gap-2">
              {badges.length > 0 ? (
                badges.map((badge) => (
                  <div
                    key={badge.name}
                    className={`p-3 rounded border text-center transition-colors ${badge.unlocked
                      ? "bg-neutral-900 border-neutral-800"
                      : "bg-neutral-950 border-neutral-900 opacity-40"
                      }`}
                  >
                    <Award
                      className={`w-5 h-5 mx-auto mb-1.5 ${badge.unlocked ? "text-neutral-400" : "text-neutral-700"}`}
                    />
                    <div
                      className={`text-[9px] tracking-wider ${badge.unlocked ? "text-neutral-300" : "text-neutral-600"}`}
                    >
                      {badge.name}
                    </div>
                    <div className="text-[8px] text-neutral-700 mt-0.5">{badge.desc}</div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-[10px] text-neutral-700 tracking-widest">
                  NO BADGES EARNED
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
