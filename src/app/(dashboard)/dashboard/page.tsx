"use client"

import { useState, useEffect, useRef } from "react"
import {
  ChevronRight,
  Shield,
  Users,
  Bell,
  RefreshCw,
  Home,
  FileText,
  Trophy,
  User,
  MessageSquare,
  Megaphone,
  Settings,
  Terminal,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import CommandCenterPage from "./command-center/page"
import AgentNetworkPage from "./agent-network/page"
import OperationsPage from "./operations/page"
import IntelligencePage from "./intelligence/page"
import SystemsPage from "./systems/page"
import ChatPage from "@/components/dashboard/chat-page"
import ProfilePage from "@/components/dashboard/profile-page"
import AnnouncementsPage from "@/components/dashboard/announcements-page"
import AdminPage from "@/components/dashboard/admin-page"

function PlaceholderPage({ title, icon: Icon, description }: { title: string; icon: any; description: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded border border-neutral-800 flex items-center justify-center">
          <Icon className="w-8 h-8 text-neutral-600" />
        </div>
        <div>
          <h2 className="text-lg text-neutral-400 tracking-wider">{title}</h2>
          <p className="text-xs text-neutral-600 mt-1">{description}</p>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="w-1 h-1 bg-neutral-700 rounded-full animate-pulse" />
          <span className="w-1 h-1 bg-neutral-700 rounded-full animate-pulse delay-100" />
          <span className="w-1 h-1 bg-neutral-700 rounded-full animate-pulse delay-200" />
        </div>
      </div>
    </div>
  )
}

function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
}: {
  isOpen: boolean
  onClose: () => void
  onNavigate: (section: string) => void
}) {
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = [
    { id: "dashboard", label: "Go to Overview", icon: Home, section: "overview" },
    { id: "team", label: "Go to Team Members", icon: Users, section: "agents" },
    { id: "events", label: "Go to CTF Events", icon: Calendar, section: "operations" },
    { id: "writeups", label: "Go to Writeups", icon: FileText, section: "intelligence" },
    { id: "rankings", label: "Go to Rankings", icon: Trophy, section: "systems" },
    { id: "chat", label: "Open Team Chat", icon: MessageSquare, section: "chat" },
    { id: "profile", label: "Open Profile", icon: User, section: "profile" },
    { id: "announce", label: "Open Announcements", icon: Megaphone, section: "announcements" },
    { id: "admin", label: "Open Admin Panel", icon: Shield, section: "admin" },
  ]

  const filteredCommands = commands.filter((cmd) => cmd.label.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    setSearch("")
    setSelectedIndex(0)
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
      } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault()
        onNavigate(filteredCommands[selectedIndex].section)
        onClose()
      } else if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onNavigate, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl mx-4 bg-neutral-950 border border-neutral-800 rounded overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3 p-4 border-b border-neutral-800">
          <Terminal className="w-4 h-4 text-neutral-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="ENTER COMMAND..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelectedIndex(0)
            }}
            className="flex-1 bg-transparent text-neutral-100 placeholder-neutral-600 outline-none text-sm tracking-wider"
          />
          <kbd className="px-2 py-1 text-xs bg-neutral-900 text-neutral-500 rounded border border-neutral-800">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.map((cmd, index) => (
            <button
              key={cmd.id}
              onClick={() => {
                onNavigate(cmd.section)
                onClose()
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded transition-colors ${index === selectedIndex ? "bg-neutral-900 text-neutral-100" : "text-neutral-400 hover:bg-neutral-900/50"
                }`}
            >
              <cmd.icon className="w-4 h-4" />
              <span className="text-sm tracking-wider">{cmd.label}</span>
            </button>
          ))}
          {filteredCommands.length === 0 && (
            <div className="text-center py-8 text-neutral-600 text-sm tracking-wider">NO COMMANDS FOUND</div>
          )}
        </div>

        <div className="flex items-center justify-between p-3 border-t border-neutral-800 text-xs text-neutral-600">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-800 mr-1">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-800">↓</kbd> NAV
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-800">↵</kbd> SELECT
            </span>
          </div>
          <span>
            <kbd className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-800">~</kbd> TOGGLE
          </span>
        </div>
      </div>
    </div>
  )
}

export default function TacticalDashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="flex h-screen bg-black">
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={setActiveSection}
      />

      <div
        className={`${sidebarCollapsed ? "w-16" : "w-56"} bg-neutral-950 border-r border-neutral-900 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full`}
      >
        <div className="p-3 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-900">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-neutral-100 text-sm tracking-[0.3em]">DEDSEC</h1>
              <p className="text-neutral-600 text-[10px] tracking-wider">CTF TEAM // X01</p>
            </div>
            {sidebarCollapsed && <span className="text-neutral-500 text-xs mx-auto tracking-wider">DS</span>}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-600 hover:text-neutral-300 hover:bg-neutral-900 h-6 w-6"
            >
              <ChevronRight className={`w-3 h-3 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`} />
            </Button>
          </div>

          <nav className="space-y-1 flex-1">
            {[
              { id: "overview", icon: Home, label: "OVERVIEW" },
              { id: "agents", icon: Users, label: "TEAM" },
              { id: "operations", icon: Calendar, label: "EVENTS" },
              { id: "intelligence", icon: FileText, label: "WRITEUPS" },
              { id: "systems", icon: Trophy, label: "RANKINGS" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded transition-colors ${activeSection === item.id
                    ? "bg-neutral-900 text-neutral-100 border-l-2 border-neutral-100"
                    : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50"
                  }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4" />
                {!sidebarCollapsed && <span className="text-xs tracking-wider">{item.label}</span>}
              </button>
            ))}

            <div className="my-3 border-t border-neutral-900" />

            {[
              { id: "chat", icon: MessageSquare, label: "CHAT" },
              { id: "profile", icon: User, label: "PROFILE" },
              { id: "announcements", icon: Megaphone, label: "ANNOUNCE" },
              { id: "admin", icon: Settings, label: "ADMIN" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded transition-colors ${activeSection === item.id
                    ? "bg-neutral-900 text-neutral-100 border-l-2 border-neutral-100"
                    : "text-neutral-600 hover:text-neutral-400 hover:bg-neutral-900/50"
                  }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4" />
                {!sidebarCollapsed && <span className="text-xs tracking-wider">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-auto pt-3 border-t border-neutral-900">
              <div className="flex items-center gap-2 p-2">
                <div className="w-8 h-8 rounded bg-neutral-900 flex items-center justify-center border border-neutral-800">
                  <span className="text-[10px] text-neutral-400">OP</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-neutral-300 tracking-wider">OPERATOR</div>
                  <div className="text-[10px] text-neutral-600">TEAM CAPTAIN</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/80 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
        <div className="h-12 bg-neutral-950 border-b border-neutral-900 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="text-xs text-neutral-500 tracking-wider">CTF://{activeSection.toUpperCase()}</div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] text-neutral-600 tracking-wider">CONNECTED</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[10px] text-neutral-600 tracking-wider hidden sm:block">
              {currentTime.toISOString().slice(0, 19).replace("T", " ")} UTC
            </div>
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-2 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <kbd className="text-[10px] text-neutral-500 tracking-wider">~</kbd>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-600 hover:text-neutral-300 hover:bg-neutral-900 h-7 w-7"
            >
              <Bell className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-600 hover:text-neutral-300 hover:bg-neutral-900 h-7 w-7"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto bg-black">
          {activeSection === "overview" && <CommandCenterPage />}
          {activeSection === "agents" && <AgentNetworkPage />}
          {activeSection === "operations" && <OperationsPage />}
          {activeSection === "intelligence" && <IntelligencePage />}
          {activeSection === "systems" && <SystemsPage />}
          {activeSection === "chat" && <ChatPage />}
          {activeSection === "profile" && <ProfilePage />}
          {activeSection === "announcements" && <AnnouncementsPage />}
          {activeSection === "admin" && <AdminPage />}
        </div>
      </div>
    </div>
  )
}
