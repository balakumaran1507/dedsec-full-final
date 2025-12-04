/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Pin, Clock, AlertTriangle, Info, CheckCircle, ChevronRight, Bell, Loader2 } from "lucide-react"
import { Announcement } from "@/types/dashboard"

export default function AnnouncementsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        // TODO: Fetch real data from API/Firebase
        // setAnnouncements([])
      } catch (error) {
        console.error("Failed to load announcements", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs text-neutral-500 tracking-widest">DECRYPTING BROADCASTS...</p>
        </div>
      </div>
    )
  }

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
          {announcements.length === 0 ? (
            <div className="p-4 text-[10px] text-neutral-700 tracking-widest text-center">
              NO ANNOUNCEMENTS
            </div>
          ) : (
            <>
              {pinnedAnnouncements.length > 0 && (
                <>
                  <div className="px-4 py-2 text-[10px] text-neutral-600 tracking-wider flex items-center gap-2">
                    <Pin className="w-3 h-3" /> PINNED
                  </div>
                  {pinnedAnnouncements.map((announcement) => (
                    <button
                      key={announcement.id}
                      onClick={() => setSelectedAnnouncement(announcement)}
                      className={`w-full p-3 border-b border-neutral-900 text-left transition-colors ${selectedAnnouncement?.id === announcement.id ? "bg-neutral-900" : "hover:bg-neutral-900/50"
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
                  className={`w-full p-3 border-b border-neutral-900 text-left transition-colors ${selectedAnnouncement?.id === announcement.id ? "bg-neutral-900" : "hover:bg-neutral-900/50"
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
        </div>
      </div>

      {/* Announcement Detail */}
      <div className="flex-1 p-6 overflow-y-auto bg-black">
        {selectedAnnouncement ? (
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
        ) : (
          <div className="flex items-center justify-center h-full text-[10px] text-neutral-700 tracking-widest">
            SELECT AN ANNOUNCEMENT
          </div>
        )}
      </div>
    </div>
  )
}
