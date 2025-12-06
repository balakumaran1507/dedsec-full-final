/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Pin, Clock, AlertTriangle, Info, CheckCircle, ChevronRight, Bell, Loader2, Plus, X, Save } from "lucide-react"
import { Announcement as DashboardAnnouncement } from "@/types/dashboard"
import { getAnnouncements, createAnnouncement, Announcement } from "@/lib/db/announcements"
import { useAuth, useIsAdmin } from "@/lib/auth/useAuth"

export default function AnnouncementsPage() {
  const { user } = useAuth()
  const isAdmin = useIsAdmin()
  const [isLoading, setIsLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<DashboardAnnouncement[]>([])
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<DashboardAnnouncement | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'urgent' | 'success',
    pinned: false
  })

  const loadAnnouncements = async () => {
    setIsLoading(true)
    try {
      const firestoreAnnouncements = await getAnnouncements()

      // Convert to dashboard format
      const dashboardAnnouncements: DashboardAnnouncement[] = firestoreAnnouncements.map(ann => {
        const date = ann.createdAt && 'toDate' in ann.createdAt
          ? ann.createdAt.toDate()
          : ann.createdAt instanceof Date
          ? ann.createdAt
          : new Date()

        return {
          id: ann.id,
          title: ann.title,
          content: ann.content,
          author: ann.author,
          type: ann.type,
          pinned: ann.pinned,
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
      })

      setAnnouncements(dashboardAnnouncements)
    } catch (error) {
      console.error("Failed to load announcements", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const handleCreateAnnouncement = async () => {
    if (!user || !newAnnouncement.title || !newAnnouncement.content) {
      alert('Please fill in all required fields')
      return
    }

    setIsCreating(true)
    try {
      await createAnnouncement({
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        type: newAnnouncement.type,
        pinned: newAnnouncement.pinned,
        author: user.displayName,
        authorUid: user.uid
      })

      setIsCreateModalOpen(false)
      await loadAnnouncements()

      // Reset form
      setNewAnnouncement({
        title: '',
        content: '',
        type: 'info',
        pinned: false
      })
    } catch (error) {
      console.error('Failed to create announcement:', error)
      alert('Failed to create announcement')
    } finally {
      setIsCreating(false)
    }
  }

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-neutral-500" />
              <span className="text-xs text-neutral-400 tracking-wider">ANNOUNCEMENTS</span>
            </div>
            {isAdmin && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                size="icon"
                className="h-6 w-6 bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            )}
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

      {/* Create Announcement Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative w-full max-w-2xl mx-4 bg-neutral-950 border border-neutral-800 rounded p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-neutral-100 tracking-wider">CREATE ANNOUNCEMENT</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-500 tracking-wider mb-2">TITLE *</label>
                <Input
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="bg-neutral-900 border-neutral-800 text-neutral-100 text-sm"
                  placeholder="Announcement title"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 tracking-wider mb-2">CONTENT *</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="w-full h-40 bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Announcement content..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-500 tracking-wider mb-2">TYPE</label>
                  <select
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value as any })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm rounded-md px-3 py-2"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 tracking-wider mb-2">OPTIONS</label>
                  <label className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2">
                    <input
                      type="checkbox"
                      checked={newAnnouncement.pinned}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, pinned: e.target.checked })}
                      className="w-4 h-4 bg-neutral-800 border-neutral-700 rounded"
                    />
                    <span className="text-sm text-neutral-300">Pin announcement</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-xs border-neutral-800 text-neutral-400 hover:bg-neutral-900 bg-transparent"
              >
                CANCEL
              </Button>
              <Button
                onClick={handleCreateAnnouncement}
                disabled={isCreating}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    CREATING...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 mr-2" />
                    CREATE ANNOUNCEMENT
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
