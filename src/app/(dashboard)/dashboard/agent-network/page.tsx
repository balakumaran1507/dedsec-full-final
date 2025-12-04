"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Clock, Flag, Activity, Signal } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

export default function AgentNetworkPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMember, setSelectedMember] = useState<any>(null)

  const members = [
    {
      id: "0x00F1",
      name: "sp3c7r0",
      status: "active",
      role: "CAPTAIN",
      specialty: "WEB",
      lastSeen: "NOW",
      solves: 245,
    },
    {
      id: "0x00F5",
      name: "n1ghtm4r3",
      status: "active",
      role: "CORE",
      specialty: "CRYPTO",
      lastSeen: "2m",
      solves: 218,
    },
    {
      id: "0x00FB",
      name: "ph4nt0m",
      status: "active",
      role: "CORE",
      specialty: "PWN",
      lastSeen: "15m",
      solves: 165,
    },
    {
      id: "0x00FC",
      name: "gh0st",
      status: "standby",
      role: "MEMBER",
      specialty: "MISC",
      lastSeen: "1h",
      solves: 89,
    },
    {
      id: "0x00FD",
      name: "d4rk0n3",
      status: "active",
      role: "CORE",
      specialty: "REV",
      lastSeen: "5m",
      solves: 142,
    },
    {
      id: "0x00FE",
      name: "cyb3rw01f",
      status: "offline",
      role: "MEMBER",
      specialty: "FORENSICS",
      lastSeen: "3d",
      solves: 78,
    },
  ]

  const activityData = [
    { hour: "00", solves: 2 },
    { hour: "04", solves: 1 },
    { hour: "08", solves: 5 },
    { hour: "12", solves: 8 },
    { hour: "16", solves: 6 },
    { hour: "20", solves: 4 },
  ]

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
                <p className="text-xl text-neutral-100">8</p>
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
                <p className="text-xl text-neutral-100">3</p>
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
                <p className="text-xl text-neutral-100">1</p>
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
                <p className="text-xl text-neutral-100">26</p>
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
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis dataKey="hour" tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#525252", fontSize: 9 }} axisLine={false} tickLine={false} width={25} />
                  <Bar dataKey="solves" fill="#525252" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-8 bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">TEAM ROSTER</CardTitle>
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
                  {filteredMembers.map((member) => (
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
                            className={`w-1.5 h-1.5 rounded-full ${
                              member.status === "active"
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
                  ))}
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
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedMember.status === "active" ? "bg-emerald-500" : "bg-neutral-600"
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
