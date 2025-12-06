/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Clock, Flag, Activity, Signal, Loader2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { TeamMember, ActivityData } from "@/types/dashboard"
import { getAllUsers } from "@/lib/db/user"
import { User } from "@/types/user"

export default function AgentNetworkPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [roleFilter, setRoleFilter] = useState<string>("all")

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const allUsers = await getAllUsers()

        // Convert User[] to TeamMember[]
        const teamMembers: TeamMember[] = allUsers.map(user => {
          // Map user roles to TeamMember roles
          const roleMap: Record<string, "CAPTAIN" | "CORE" | "MEMBER"> = {
            'founder': 'CAPTAIN',
            'admin': 'CORE',
            'member': 'MEMBER'
          }

          return {
            id: user.uid.slice(0, 8).toUpperCase(),
            name: user.displayName,
            status: 'offline' as const, // Default status - could be enhanced with real-time presence
            specialty: user.bio || 'Security Researcher',
            role: roleMap[user.role] || 'MEMBER',
            lastSeen: formatLastSeen(user.joinDate),
            solves: user.stats.writeupCount
          }
        })

        setMembers(teamMembers)
      } catch (error) {
        console.error("Failed to load team data", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const formatLastSeen = (joinDate: any) => {
    const date = joinDate && 'toDate' in joinDate
      ? joinDate.toDate()
      : joinDate instanceof Date
        ? joinDate
        : new Date()

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 30) return `${diffDays}d ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
    return `${Math.floor(diffDays / 365)}y ago`
  }

  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || m.role.toLowerCase() === roleFilter.toLowerCase()
    return matchesSearch && matchesRole
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs text-neutral-500 tracking-widest">SCANNING NETWORK...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg text-neutral-200 tracking-[0.2em]">TEAM</h1>
          <p className="text-[10px] text-neutral-600 tracking-wider">MEMBER ROSTER</p>
        </div>
        <Button className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs tracking-wider">
          + INVITE
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-neutral-950 border-neutral-900">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-600 tracking-wider">ONLINE</p>
                <p className="text-xl text-neutral-100">{members.filter(m => m.status === 'active').length}</p>
              </div>
              <Signal className="w-5 h-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-950 border-neutral-900">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-600 tracking-wider">AWAY</p>
                <p className="text-xl text-neutral-100">{members.filter(m => m.status === 'standby').length}</p>
              </div>
              <Clock className="w-5 h-5 text-neutral-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-950 border-neutral-900">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-600 tracking-wider">OFFLINE</p>
                <p className="text-xl text-neutral-100">{members.filter(m => m.status === 'offline').length}</p>
              </div>
              <Flag className="w-5 h-5 text-neutral-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-950 border-neutral-900">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-600 tracking-wider">SOLVES TODAY</p>
                <p className="text-xl text-neutral-100">0</p>
              </div>
              <Activity className="w-5 h-5 text-neutral-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-4 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">TEAM ACTIVITY 24H</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-40 flex items-center justify-center">
              {activityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <XAxis dataKey="time" tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} width={25} />
                    <Bar dataKey="active" fill="#525252" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-[10px] text-neutral-700 tracking-widest">NO ACTIVITY DATA</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-8 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">TEAM ROSTER</CardTitle>
                <div className="flex gap-1">
                  {['all', 'member', 'admin', 'founder'].map(role => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`px-2 py-1 text-[9px] tracking-wider rounded transition-colors ${roleFilter === role
                          ? 'bg-neutral-800 text-neutral-200'
                          : 'text-neutral-600 hover:text-neutral-400'
                        }`}
                    >
                      {role.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative w-48">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-neutral-600" />
                <Input
                  placeholder="SEARCH..."
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
                    <th className="text-left py-2 px-4 text-[10px] text-neutral-600 tracking-wider">ID</th>
                    <th className="text-left py-2 px-4 text-[10px] text-neutral-600 tracking-wider">HANDLE</th>
                    <th className="text-left py-2 px-4 text-[10px] text-neutral-600 tracking-wider">STATUS</th>
                    <th className="text-left py-2 px-4 text-[10px] text-neutral-600 tracking-wider">SPECIALTY</th>
                    <th className="text-left py-2 px-4 text-[10px] text-neutral-600 tracking-wider">LAST</th>
                    <th className="text-left py-2 px-4 text-[10px] text-neutral-600 tracking-wider">SOLVES</th>
                    <th className="text-left py-2 px-4 text-[10px] text-neutral-600 tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b border-neutral-900/50 hover:bg-neutral-900/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedMember(member)}
                      >
                        <td className="py-2 px-4 text-[10px] text-neutral-500">{member.id}</td>
                        <td className="py-2 px-4 text-xs text-neutral-300 tracking-wider">{member.name}</td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${member.status === "active"
                                ? "bg-emerald-500"
                                : member.status === "standby"
                                  ? "bg-neutral-500"
                                  : "bg-neutral-700"
                                }`}
                            />
                            <span className="text-[10px] text-neutral-500 tracking-wider uppercase">{member.status}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 text-[10px] text-neutral-400">{member.specialty}</td>
                        <td className="py-2 px-4 text-[10px] text-neutral-600">{member.lastSeen}</td>
                        <td className="py-2 px-4 text-[10px] text-neutral-400">{member.solves}</td>
                        <td className="py-2 px-4">
                          <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-neutral-300 h-6 w-6">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[10px] text-neutral-700 tracking-widest">
                        NO MEMBERS FOUND
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedMember && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-950 border-neutral-800 w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm text-neutral-200 tracking-wider">{selectedMember.name}</CardTitle>
                <p className="text-[10px] text-neutral-600">{selectedMember.id}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedMember(null)}
                className="text-neutral-600 hover:text-neutral-300 h-6 w-6 p-0"
              >
                x
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-[10px]">
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">STATUS</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${selectedMember.status === "active" ? "bg-emerald-500" : "bg-neutral-600"
                        }`}
                    />
                    <span className="text-neutral-300 uppercase">{selectedMember.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">SPECIALTY</p>
                  <p className="text-neutral-300">{selectedMember.specialty}</p>
                </div>
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">ROLE</p>
                  <p className="text-neutral-300">{selectedMember.role}</p>
                </div>
                <div>
                  <p className="text-neutral-600 tracking-wider mb-1">TOTAL SOLVES</p>
                  <p className="text-neutral-300">{selectedMember.solves}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[10px] tracking-wider h-8">
                  VIEW PROFILE
                </Button>
                <Button className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[10px] tracking-wider h-8">
                  MESSAGE
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
