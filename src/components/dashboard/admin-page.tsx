"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Users, UserPlus, Shield, Check, X, Ban, MoreHorizontal, AlertTriangle } from "lucide-react"

const members = [
  { id: 1, name: "sp3c7r0", email: "sp3c7r0@dedsec.io", role: "CAPTAIN", status: "active", joined: "2023-03-15" },
  { id: 2, name: "n1ghtm4r3", email: "n1ghtm4r3@dedsec.io", role: "MEMBER", status: "active", joined: "2023-04-22" },
  { id: 3, name: "ph4nt0m", email: "ph4nt0m@dedsec.io", role: "MEMBER", status: "active", joined: "2023-05-10" },
  { id: 4, name: "gh0st", email: "gh0st@dedsec.io", role: "MEMBER", status: "active", joined: "2024-01-08" },
  { id: 5, name: "d4rk0n3", email: "d4rk0n3@dedsec.io", role: "MEMBER", status: "active", joined: "2023-06-30" },
  { id: 6, name: "cyb3rw01f", email: "cyb3rw01f@dedsec.io", role: "MEMBER", status: "active", joined: "2024-02-14" },
  { id: 7, name: "sh4d0w", email: "sh4d0w@dedsec.io", role: "MEMBER", status: "banned", joined: "2023-08-01" },
]

const pendingRequests = [
  { id: 101, name: "h4ck3r_x", email: "hackerx@mail.com", specialty: "PWN", requestedAt: "2024-12-02" },
  { id: 102, name: "crypt0_k1ng", email: "cryptok@mail.com", specialty: "CRYPTO", requestedAt: "2024-12-01" },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"members" | "pending" | "settings">("members")

  return (
    <div className="p-4 space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "TOTAL MEMBERS", value: members.filter((m) => m.status === "active").length, icon: Users },
          { label: "PENDING", value: pendingRequests.length, icon: UserPlus },
          { label: "BANNED", value: members.filter((m) => m.status === "banned").length, icon: Ban },
          { label: "CAPTAINS", value: members.filter((m) => m.role === "CAPTAIN").length, icon: Shield },
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

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-900 pb-px">
        {[
          { id: "members", label: "MEMBERS" },
          { id: "pending", label: "PENDING REQUESTS" },
          { id: "settings", label: "SETTINGS" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-xs tracking-wider transition-colors ${activeTab === tab.id
                ? "text-neutral-100 border-b-2 border-neutral-100 -mb-px"
                : "text-neutral-600 hover:text-neutral-400"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Members Tab */}
      {activeTab === "members" && (
        <Card className="bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">TEAM ROSTER</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] text-neutral-600 tracking-wider border-b border-neutral-900">
                  <th className="text-left p-3">USER</th>
                  <th className="text-left p-3">ROLE</th>
                  <th className="text-left p-3">STATUS</th>
                  <th className="text-left p-3">JOINED</th>
                  <th className="text-right p-3">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-neutral-900 hover:bg-neutral-900/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-neutral-900 rounded-full flex items-center justify-center border border-neutral-800">
                          <span className="text-[9px] text-neutral-500">{member.name.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="text-xs text-neutral-300">{member.name}</div>
                          <div className="text-[10px] text-neutral-700">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded ${member.role === "CAPTAIN"
                            ? "bg-red-950/50 text-red-500 border border-red-900/50"
                            : "bg-neutral-900 text-neutral-500 border border-neutral-800"
                          }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`flex items-center gap-1.5 text-[10px] ${member.status === "banned" ? "text-red-500" : "text-emerald-500"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${member.status === "banned" ? "bg-red-500" : "bg-emerald-500"
                            }`}
                        />
                        {member.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-[10px] text-neutral-600">{member.joined}</td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-600 hover:text-neutral-300">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Pending Tab */}
      {activeTab === "pending" && (
        <Card className="bg-neutral-950 border-neutral-900">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">JOIN REQUESTS</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-neutral-600 text-sm">No pending requests</div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 bg-neutral-900 rounded border border-neutral-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-neutral-800 rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-neutral-500">{request.name.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-300">{request.name}</div>
                        <div className="text-[10px] text-neutral-600">{request.email}</div>
                      </div>
                    </div>
                    <div className="text-[10px] text-neutral-600">{request.specialty}</div>
                    <div className="text-[10px] text-neutral-700">{request.requestedAt}</div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-7 px-3 text-[10px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        APPROVE
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-3 text-[10px] text-neutral-500 hover:text-red-500 hover:bg-red-950/30"
                      >
                        <X className="w-3 h-3 mr-1" />
                        DENY
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-4">
          <Card className="bg-neutral-950 border-neutral-900">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-[10px] text-neutral-500 tracking-[0.2em]">TEAM SETTINGS</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-neutral-900">
                <div>
                  <div className="text-xs text-neutral-300">Team Name</div>
                  <div className="text-[10px] text-neutral-600">Display name on CTFtime</div>
                </div>
                <span className="text-xs text-neutral-400">DEDSEC X01</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-900">
                <div>
                  <div className="text-xs text-neutral-300">Max Members</div>
                  <div className="text-[10px] text-neutral-600">Team member limit</div>
                </div>
                <span className="text-xs text-neutral-400">12</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-900">
                <div>
                  <div className="text-xs text-neutral-300">Join Mode</div>
                  <div className="text-[10px] text-neutral-600">How new members join</div>
                </div>
                <span className="text-xs text-neutral-400">APPROVAL REQUIRED</span>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-neutral-950 border-red-950">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-[10px] text-red-500 tracking-[0.2em] flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" />
                DANGER ZONE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-300">Delete Team</div>
                  <div className="text-[10px] text-neutral-600">Permanently delete this team and all data</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-3 text-[10px] text-red-500 hover:text-red-400 hover:bg-red-950/30 border border-red-900/50"
                >
                  DELETE TEAM
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
