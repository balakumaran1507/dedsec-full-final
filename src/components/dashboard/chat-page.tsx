"use client"

import { useState, useRef, useEffect } from "react"
import { Hash, Users, Send, AtSign, Smile, Paperclip, Pin, Volume2, Settings, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"

const channels = [
  { id: "general", name: "general", unread: 0 },
  { id: "ctf-live", name: "ctf-live", unread: 3 },
  { id: "web", name: "web", unread: 0 },
  { id: "pwn", name: "pwn", unread: 1 },
  { id: "crypto", name: "crypto", unread: 0 },
  { id: "rev", name: "rev", unread: 0 },
  { id: "writeups", name: "writeups", unread: 0 },
]

const members = [
  { id: 1, name: "sp3c7r0", role: "CAPTAIN", status: "online", specialty: "WEB" },
  { id: 2, name: "n1ghtm4r3", role: "MEMBER", status: "online", specialty: "CRYPTO" },
  { id: 3, name: "ph4nt0m", role: "MEMBER", status: "online", specialty: "PWN" },
  { id: 4, name: "gh0st", role: "MEMBER", status: "idle", specialty: "MISC" },
  { id: 5, name: "d4rk0n3", role: "MEMBER", status: "online", specialty: "REV" },
  { id: 6, name: "cyb3rw01f", role: "MEMBER", status: "offline", specialty: "FORENSICS" },
]

const initialMessages = [
  {
    id: 1,
    user: "sp3c7r0",
    role: "CAPTAIN",
    time: "14:23",
    content: "Team, focus on the web challenges. I see low solve count there.",
  },
  { id: 2, user: "n1ghtm4r3", role: "MEMBER", time: "14:25", content: "On it. The SQLi one looks interesting." },
  {
    id: 3,
    user: "ph4nt0m",
    role: "MEMBER",
    time: "14:28",
    content: "Anyone got the binary for pwn03? Link seems broken.",
  },
  { id: 4, user: "d4rk0n3", role: "MEMBER", time: "14:30", content: "Just got first blood on the keygen challenge!" },
  { id: 5, user: "sp3c7r0", role: "CAPTAIN", time: "14:31", content: "Nice work d4rk0n3. Keep pushing." },
  {
    id: 6,
    user: "gh0st",
    role: "MEMBER",
    time: "14:35",
    content: "The misc challenge is just a rabbit hole. Moving to forensics.",
  },
]

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState("general")
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!inputValue.trim()) return
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        user: "OPERATOR",
        role: "CAPTAIN",
        time: new Date().toTimeString().slice(0, 5),
        content: inputValue,
      },
    ])
    setInputValue("")
  }

  return (
    <div className="flex h-full">
      {/* Channel Sidebar */}
      <div className="w-48 bg-neutral-950 border-r border-neutral-900 flex flex-col">
        <div className="p-3 border-b border-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 tracking-wider">DEDSEC X01</span>
            <ChevronDown className="w-3 h-3 text-neutral-600" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-[10px] text-neutral-600 tracking-wider px-2 py-2">TEXT CHANNELS</div>
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${activeChannel === channel.id
                  ? "bg-neutral-900 text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50"
                }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span className="flex-1 text-left">{channel.name}</span>
              {channel.unread > 0 && (
                <span className="w-4 h-4 bg-red-600 rounded-full text-[9px] flex items-center justify-center text-white">
                  {channel.unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* User Footer */}
        <div className="p-2 border-t border-neutral-900 bg-neutral-950">
          <div className="flex items-center gap-2 p-1.5 rounded hover:bg-neutral-900 transition-colors">
            <div className="relative">
              <div className="w-7 h-7 bg-neutral-800 rounded-full flex items-center justify-center">
                <span className="text-[9px] text-neutral-400">OP</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-neutral-950 rounded-full" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-neutral-300">OPERATOR</div>
              <div className="text-[9px] text-neutral-600">Online</div>
            </div>
            <Settings className="w-3 h-3 text-neutral-600" />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-black">
        {/* Channel Header */}
        <div className="h-11 border-b border-neutral-900 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-neutral-600" />
            <span className="text-sm text-neutral-300">{activeChannel}</span>
            <span className="text-neutral-800">|</span>
            <span className="text-[10px] text-neutral-600">CTF team discussion channel</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-600 hover:text-neutral-300">
              <Pin className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-600 hover:text-neutral-300">
              <Volume2 className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-600 hover:text-neutral-300">
              <Users className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 group">
              <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center shrink-0 border border-neutral-800">
                <span className="text-[9px] text-neutral-500">{msg.user.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium ${msg.role === "CAPTAIN" ? "text-red-500" : "text-neutral-300"}`}
                  >
                    {msg.user}
                  </span>
                  {msg.role === "CAPTAIN" && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-red-950/50 text-red-500 rounded border border-red-900/50">
                      CAPTAIN
                    </span>
                  )}
                  <span className="text-[10px] text-neutral-700">{msg.time}</span>
                </div>
                <p className="text-sm text-neutral-400 mt-0.5">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-neutral-900">
          <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded px-3 py-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-600 hover:text-neutral-400">
              <Paperclip className="w-4 h-4" />
            </Button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={`Message #${activeChannel}`}
              className="flex-1 bg-transparent text-sm text-neutral-200 placeholder-neutral-600 outline-none"
            />
            <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-600 hover:text-neutral-400">
              <AtSign className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-600 hover:text-neutral-400">
              <Smile className="w-4 h-4" />
            </Button>
            <Button
              onClick={sendMessage}
              size="icon"
              className="h-6 w-6 bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Members Sidebar */}
      <div className="w-48 bg-neutral-950 border-l border-neutral-900 p-3 hidden lg:block">
        <div className="text-[10px] text-neutral-600 tracking-wider mb-3">
          ONLINE — {members.filter((m) => m.status === "online").length}
        </div>
        <div className="space-y-1">
          {members
            .filter((m) => m.status === "online")
            .map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 p-1.5 rounded hover:bg-neutral-900 transition-colors"
              >
                <div className="relative">
                  <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-neutral-500">{member.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-neutral-950 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-[10px] truncate ${member.role === "CAPTAIN" ? "text-red-500" : "text-neutral-400"}`}
                  >
                    {member.name}
                  </div>
                  <div className="text-[9px] text-neutral-700">{member.specialty}</div>
                </div>
              </div>
            ))}
        </div>

        <div className="text-[10px] text-neutral-600 tracking-wider mt-4 mb-3">
          OFFLINE — {members.filter((m) => m.status === "offline").length}
        </div>
        <div className="space-y-1 opacity-50">
          {members
            .filter((m) => m.status === "offline" || m.status === "idle")
            .map((member) => (
              <div key={member.id} className="flex items-center gap-2 p-1.5">
                <div className="w-6 h-6 bg-neutral-900 rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-neutral-600">{member.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <span className="text-[10px] text-neutral-600 truncate">{member.name}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
