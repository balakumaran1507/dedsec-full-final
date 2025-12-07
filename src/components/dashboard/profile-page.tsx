/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Trophy, Flag, Target, Clock, Award, TrendingUp, Edit2, Loader2, User as UserIcon, X, Save, RefreshCw } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { SolveHistoryData, CategoryData, DifficultyStat, RecentSolve, Badge as DashboardBadge } from "@/types/dashboard"
import { useProfile, useUpdateProfile } from "@/lib/hooks/useProfile"
import { useAuth } from "@/lib/auth/useAuth"

export default function ProfilePage() {
  const { user: currentUser } = useAuth()
  const { profile, recentWriteups, loading, error } = useProfile()
  const { updateProfile, updating } = useUpdateProfile()
  const [solveHistory, setSolveHistory] = useState<SolveHistoryData[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryData[]>([])
  const [difficultyBreakdown, setDifficultyBreakdown] = useState<DifficultyStat[]>([])
  const [recentSolves, setRecentSolves] = useState<RecentSolve[]>([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    discordId: '',
    socialLinks: {
      twitter: '',
      github: '',
      website: ''
    }
  })

  // Fetch profile stats
  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      const res = await fetch(`/api/profile/stats?userId=${currentUser?.uid || 'default'}`)
      const data = await res.json()

      if (data.success) {
        setSolveHistory(data.data.solveHistory)
        setCategoryStats(data.data.categoryStats)
        setDifficultyBreakdown(data.data.difficultyBreakdown)
        setRecentSolves(data.data.recentSolves)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser?.uid) {
      fetchStats()
    }
  }, [currentUser?.uid])

  // Convert user badges to dashboard badges format
  const dashboardBadges: DashboardBadge[] = profile?.badges?.map(badge => ({
    name: badge.name,
    desc: badge.description || '',
    unlocked: true
  })) || []

  const handleEditClick = () => {
    if (profile) {
      setEditForm({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        discordId: ('discordId' in profile ? profile.discordId : '') || '',
        socialLinks: {
          twitter: profile.socialLinks?.twitter || '',
          github: profile.socialLinks?.github || '',
          website: profile.socialLinks?.website || ''
        }
      })
      setIsEditModalOpen(true)
    }
  }

  const handleSaveProfile = async () => {
    if (!currentUser?.uid) return

    try {
      await updateProfile(currentUser.uid, editForm)
      setIsEditModalOpen(false)
    } catch (err) {
      console.error('Failed to update profile:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs text-neutral-500 tracking-widest">LOADING OPERATOR PROFILE...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <p className="text-xs text-red-500 tracking-widest">{error || 'PROFILE NOT FOUND'}</p>
          {currentUser && !profile && (
            <div className="mt-4 p-4 bg-neutral-900 border border-neutral-800 rounded">
              <p className="text-xs text-neutral-400 mb-4">
                Your profile hasn't been initialized yet. This usually happens with older accounts.
              </p>
              <Button
                onClick={async () => {
                  try {
                    // Initialize profile with basic data
                    const { createUser } = await import('@/lib/db/user')
                    await createUser({
                      uid: currentUser.uid,
                      email: currentUser.email || 'user@example.com',
                      displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
                      role: 'member' as const,
                      stats: {
                        writeupCount: 0,
                        totalUpvotes: 0,
                        ctfParticipation: 0
                      },
                      photoURL: currentUser.photoURL || null,
                      bio: null,
                      discordId: null,
                      socialLinks: null
                    })
                    window.location.reload()
                  } catch (err) {
                    console.error('Failed to initialize profile:', err)
                    alert('Failed to initialize profile. Please check console for details.')
                  }
                }}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Initialize Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Format join date
  const joinDate = profile.joinDate && 'toDate' in profile.joinDate
    ? profile.joinDate.toDate()
    : profile.joinDate instanceof Date
      ? profile.joinDate
      : new Date()

  const formattedJoinDate = joinDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()

  return (
    <div className="p-4 space-y-4">
      {/* Profile Header */}
      <div className="flex items-start gap-6 p-4 bg-neutral-950 border border-neutral-900 rounded">
        <div className="relative">
          <div className="w-20 h-20 bg-neutral-900 rounded border border-neutral-800 flex items-center justify-center overflow-hidden">
            {profile.photoURL ? (
              <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-8 h-8 text-neutral-500" />
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-neutral-500 border-2 border-neutral-950 rounded-full" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl text-neutral-100 tracking-wider">{(profile.displayName || 'User').toUpperCase()}</h2>
            {'role' in profile && profile.role && (
              <span className="text-[10px] px-2 py-0.5 bg-red-950/50 text-red-500 rounded border border-red-900/50">
                {profile.role.toUpperCase()}
              </span>
            )}
            <span className="text-xs text-neutral-500 font-mono tracking-wider">{profile.title || 'ROOKIE'}</span>
          </div>
          {profile.bio && (
            <p className="text-xs text-neutral-400 mt-1">{profile.bio}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-[10px] text-neutral-500">
            <span>JOINED: {formattedJoinDate}</span>
            <span>|</span>
            <span>CTFS: {profile.stats?.ctfParticipation || 0}</span>
            <span>|</span>
            <span>RANK: #{profile.rank || 0} GLOBAL</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            disabled={statsLoading}
            className="text-xs border-neutral-800 text-neutral-400 hover:bg-neutral-900 bg-transparent"
          >
            <RefreshCw className={`w-3 h-3 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
            REFRESH
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditClick}
            className="text-xs border-neutral-800 text-neutral-400 hover:bg-neutral-900 bg-transparent"
          >
            <Edit2 className="w-3 h-3 mr-2" />
            EDIT
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative w-full max-w-2xl mx-4 bg-neutral-950 border border-neutral-800 rounded p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-neutral-100 tracking-wider">EDIT PROFILE</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-500 tracking-wider mb-2">DISPLAY NAME</label>
                <Input
                  value={editForm.displayName}
                  onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                  className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                  placeholder="Your display name"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 tracking-wider mb-2">BIO</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full h-24 bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 tracking-wider mb-2">DISCORD ID</label>
                <Input
                  value={editForm.discordId}
                  onChange={(e) => setEditForm({ ...editForm, discordId: e.target.value })}
                  className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                  placeholder="your_discord_id"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 tracking-wider mb-2">SOCIAL LINKS</label>
                <div className="space-y-3">
                  <Input
                    value={editForm.socialLinks.twitter}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      socialLinks: { ...editForm.socialLinks, twitter: e.target.value }
                    })}
                    className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                    placeholder="Twitter/X username"
                  />
                  <Input
                    value={editForm.socialLinks.github}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      socialLinks: { ...editForm.socialLinks, github: e.target.value }
                    })}
                    className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                    placeholder="GitHub username"
                  />
                  <Input
                    value={editForm.socialLinks.website}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      socialLinks: { ...editForm.socialLinks, website: e.target.value }
                    })}
                    className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                    placeholder="Website URL"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="text-xs border-neutral-800 text-neutral-400 hover:bg-neutral-900 bg-transparent"
              >
                CANCEL
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={updating}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    SAVING...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 mr-2" />
                    SAVE CHANGES
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "WRITEUPS", value: (profile.stats?.writeupCount || 0).toString(), icon: Flag },
          { label: "CONTRIBUTION SCORE", value: (profile.contributionScore || 0).toString(), icon: Trophy },
          { label: "TOTAL UPVOTES", value: (profile.stats?.totalUpvotes || 0).toString(), icon: TrendingUp },
          { label: "CTF EVENTS", value: (profile.stats?.ctfParticipation || 0).toString(), icon: Target },
          { label: "GLOBAL RANK", value: `#${profile.rank || 0}`, icon: Award },
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
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#171717',
                        border: '1px solid #262626',
                        borderRadius: '4px',
                        fontSize: '10px'
                      }}
                      labelStyle={{ color: '#a3a3a3' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="solves"
                      stroke="#525252"
                      strokeWidth={2}
                      dot={{ fill: "#525252", r: 3 }}
                      activeDot={{ r: 5, fill: "#a3a3a3" }}
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
                            <Cell key={`cell-${index}`} fill={['#262626', '#404040', '#525252', '#737373', '#a3a3a3', '#d4d4d4'][index % 6]} />
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
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#171717',
                        border: '1px solid #262626',
                        borderRadius: '4px',
                        fontSize: '10px'
                      }}
                      labelStyle={{ color: '#a3a3a3' }}
                      cursor={{ fill: 'rgba(163, 163, 163, 0.1)' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {difficultyBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === 'Easy' ? '#404040' :
                              entry.name === 'Med' ? '#737373' :
                                '#a3a3a3'
                          }
                        />
                      ))}
                    </Bar>
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
                    className="flex items-center justify-between py-2 px-2 -mx-2 border-b border-neutral-900 last:border-0 hover:bg-neutral-900/50 transition-colors cursor-pointer rounded"
                  >
                    <div className="flex items-center gap-3">
                      <Flag className="w-3.5 h-3.5 text-neutral-500" />
                      <div>
                        <div className="text-xs text-neutral-300 hover:text-neutral-100 transition-colors">{solve.name}</div>
                        <div className="text-[10px] text-neutral-600">{solve.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-neutral-400 font-mono">{solve.points} pts</div>
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
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">BADGES ({dashboardBadges.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-3 gap-2">
              {dashboardBadges.length > 0 ? (
                dashboardBadges.map((badge) => (
                  <div
                    key={badge.name}
                    className="p-3 rounded border text-center transition-colors bg-neutral-900 border-neutral-800"
                  >
                    <Award className="w-5 h-5 mx-auto mb-1.5 text-neutral-500" />
                    <div className="text-[9px] tracking-wider text-neutral-300">
                      {badge.name.toUpperCase()}
                    </div>
                    {badge.desc && (
                      <div className="text-[8px] text-neutral-600 mt-0.5">{badge.desc}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-[10px] text-neutral-700 tracking-widest">
                  NO BADGES EARNED YET
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
