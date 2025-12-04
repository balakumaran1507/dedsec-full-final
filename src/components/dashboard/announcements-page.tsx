"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Pin, Clock, AlertTriangle, Info, CheckCircle, ChevronRight, Bell } from "lucide-react"

const announcements = [
  {
    id: 1,
    title: "HKCERT CTF 2024 Registration",
    type: "urgent",
    pinned: true,
    date: "2024-12-01",
    author: "sp3c7r0",
    content:
      "Registration closes in 48 hours. Make sure all team members have confirmed participation. Check your emails for the registration link.",
  },
  {
    id: 2,
    title: "New Writeup Guidelines",
    type: "info",
    pinned: true,
    date: "2024-11-28",
    author: "n1ghtm4r3",
    content:
      "Updated our writeup template. Please follow the new format for all future submissions. Check the wiki for details.",
  },
  {
    id: 3,
    title: "Weekly Practice Session",
    type: "normal",
    pinned: false,
    date: "2024-11-25",
    author: "ph4nt0m",
    content: "Saturday 8PM UTC - Web exploitation focus. Bring your favorite tools.",
  },
  {
    id: 4,
    title: "Server Maintenance Complete",
    type: "success",
    pinned: false,
    date: "2024-11-22",
    author: "d4rk0n3",
    content: "All infrastructure has been updated. New challenge environment is live.",
  },
  {
    id: 5,
    title: "Welcome New Members",
    type: "info",
    pinned: false,
    date: "2024-11-20",
    author: "sp3c7r0",
    content: "Welcome cyb3rw01f and gh0st to the team. Check the onboarding docs in #general.",
  },
]

export default function AnnouncementsPage() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(announcements[0])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
      case "success":
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
      default:
        return <Info className="w-3.5 h-3.5 text-neutral-500" />
    }
  }

  const pinnedAnnouncements = announcements.filter((a) => a.pinned)
  const recentAnnouncements = announcements.filter((a) => !a.pinned)

  return (
    <div className="flex h-full">
      {/* Announcement List */}
      <div className="w-80 bg-neutral-950 border-r border-neutral-900 flex flex-col">
        <div className="p-4 border-b border-neutral-900">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-neutral-500" />
            <span className="text-xs text-neutral-400 tracking-wider">ANNOUNCEMENTS</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {pinnedAnnouncements.length > 0 && (
            <>
              <div className="px-4 py-2 text-[10px] text-neutral-600 tracking-wider flex items-center gap-2">
                <Pin className="w-3 h-3" /> PINNED
              </div>
              {pinnedAnnouncements.map((announcement) => (
                <button
                  key={announcement.id}
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className={`w-full p-3 border-b border-neutral-900 text-left transition-colors ${selectedAnnouncement.id === announcement.id ? "bg-neutral-900" : "hover:bg-neutral-900/50"
                    }`}
                >
                  <div className="flex items-start gap-2">
                    {getTypeIcon(announcement.type)}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-neutral-300 truncate">{announcement.title}</div>
                      <div className="text-[10px] text-neutral-600 mt-0.5">{announcement.date}</div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-neutral-700 shrink-0" />
                  </div>
                </button>
              ))}
            </>
          )}

          <div className="px-4 py-2 text-[10px] text-neutral-600 tracking-wider flex items-center gap-2 mt-2">
            <Clock className="w-3 h-3" /> RECENT
          </div>
          {recentAnnouncements.map((announcement) => (
            <button
              key={announcement.id}
              onClick={() => setSelectedAnnouncement(announcement)}
              className={`w-full p-3 border-b border-neutral-900 text-left transition-colors ${selectedAnnouncement.id === announcement.id ? "bg-neutral-900" : "hover:bg-neutral-900/50"
                }`}
            >
              <div className="flex items-start gap-2">
                {getTypeIcon(announcement.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-neutral-300 truncate">{announcement.title}</div>
                  <div className="text-[10px] text-neutral-600 mt-0.5">{announcement.date}</div>
                </div>
                <ChevronRight className="w-3 h-3 text-neutral-700 shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Announcement Detail */}
      <div className="flex-1 p-6 overflow-y-auto bg-black">
        {selectedAnnouncement && (
          <Card className="bg-neutral-950 border-neutral-900 max-w-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(selectedAnnouncement.type)}
                    {selectedAnnouncement.pinned && <Pin className="w-3 h-3 text-neutral-600" />}
                    {selectedAnnouncement.type === "urgent" && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-red-950/50 text-red-500 rounded border border-red-900/50">
                        URGENT
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg text-neutral-100 tracking-wide">{selectedAnnouncement.title}</CardTitle>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-neutral-600 mt-2">
                <span>BY: {selectedAnnouncement.author.toUpperCase()}</span>
                <span>|</span>
                <span>{selectedAnnouncement.date}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-400 leading-relaxed">{selectedAnnouncement.content}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
