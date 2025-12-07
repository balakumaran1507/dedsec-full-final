/* eslint-disable */
"use client"

import { useState, useRef, useEffect } from "react"
import { Hash, Users, Send, AtSign, Smile, Paperclip, Pin, Volume2, Settings, ChevronDown, Loader2, Wifi, WifiOff } from "lucide-react"
import { Button } from "./ui/button"
import { ChatChannel as DashboardChatChannel, ChatMessage as DashboardChatMessage, TeamMember } from "@/types/dashboard"
import { ChatChannel } from "@/types/chat"
import { useSocketChat } from "@/lib/hooks/useSocketChat"
import { useAuth } from "@/lib/auth/useAuth"

export default function ChatPage() {
  const { user } = useAuth()
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize Socket.io chat
  const {
    isConnected,
    isConnecting,
    currentChannel,
    messages: socketMessages,
    onlineUsers,
    sendMessage: sendSocketMessage,
    switchChannel,
  } = useSocketChat({
    username: user?.displayName || 'Anonymous',
    initialChannel: 'general',
    autoConnect: true
  })

  const channels: { id: ChatChannel; name: string; unread: number }[] = [
    { id: "general", name: "general", unread: 0 },
    { id: "ops", name: "operations", unread: 0 },
    { id: "intel", name: "writeups", unread: 0 },
    { id: "ai-lab", name: "ai-lab", unread: 0 }
  ]

  // Convert socket messages to dashboard format
  const messages: DashboardChatMessage[] = socketMessages.map(msg => {
    const timestamp = new Date(msg.timestamp)

    return {
      id: msg.id,
      user: msg.username,
      role: 'MEMBER' as const,
      time: timestamp.toTimeString().slice(0, 5),
      content: msg.content
    }
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    sendSocketMessage(inputValue)
    setInputValue("")
  }

  const handleChannelSwitch = (channelId: ChatChannel) => {
    switchChannel(channelId)
  }

  if (isConnecting && !isConnected) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs text-neutral-500 tracking-widest">ESTABLISHING SECURE CONNECTION...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Channel Sidebar */}
      <div className="w-48 bg-neutral-950 border-r border-neutral-900 flex flex-col">
        <div className="p-3 border-b border-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 tracking-wider">DEDSEC X01</span>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="w-3 h-3 text-emerald-500" aria-label="Connected" />
              ) : (
                <WifiOff className="w-3 h-3 text-red-500" aria-label="Disconnected" />
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-[10px] text-neutral-600 tracking-wider px-2 py-2">TEXT CHANNELS</div>
          {channels.length > 0 ? (
            channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => handleChannelSwitch(channel.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${currentChannel === channel.id
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
            ))
          ) : (
            <div className="px-2 py-2 text-[10px] text-neutral-700">NO CHANNELS</div>
          )}
        </div>

        {/* User Footer */}
        <div className="p-2 border-t border-neutral-900 bg-neutral-950">
          <div className="flex items-center gap-2 p-1.5 rounded hover:bg-neutral-900 transition-colors">
            <div className="relative">
              <div className="w-7 h-7 bg-neutral-800 rounded-full flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] text-neutral-400">
                    {user?.displayName?.slice(0, 2).toUpperCase() || 'OP'}
                  </span>
                )}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${isConnected ? 'bg-emerald-500' : 'bg-neutral-600'} border-2 border-neutral-950 rounded-full`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-neutral-300 truncate">{user?.displayName || 'OPERATOR'}</div>
              <div className="text-[9px] text-neutral-600">{isConnected ? 'Online' : 'Offline'}</div>
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
            <span className="text-sm text-neutral-300">{currentChannel}</span>
            <span className="text-neutral-800">|</span>
            <span className="text-[10px] text-neutral-600">CTF team discussion channel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[10px] text-neutral-600 flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{onlineUsers.length}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-600 hover:text-neutral-300">
              <Pin className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-600 hover:text-neutral-300">
              <Volume2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center shrink-0 border border-neutral-800">
                  <span className="text-[9px] text-neutral-500">{msg.user.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-neutral-300">
                      {msg.user}
                    </span>
                    <span className="text-[10px] text-neutral-700">{msg.time}</span>
                  </div>
                  <p className="text-sm text-neutral-400 mt-0.5">{msg.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-[10px] text-neutral-700 tracking-widest">
              {isConnected ? 'NO MESSAGES' : 'DISCONNECTED FROM SERVER'}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-neutral-900">
          <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded px-3 py-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-600 hover:text-neutral-400" disabled={!isConnected}>
              <Paperclip className="w-4 h-4" />
            </Button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              placeholder={isConnected ? `Message #${currentChannel}` : 'Connecting...'}
              disabled={!isConnected}
              className="flex-1 bg-transparent text-sm text-neutral-200 placeholder-neutral-600 outline-none disabled:opacity-50"
            />
            <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-600 hover:text-neutral-400" disabled={!isConnected}>
              <AtSign className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-600 hover:text-neutral-400" disabled={!isConnected}>
              <Smile className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!isConnected || !inputValue.trim()}
              size="icon"
              className="h-6 w-6 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Members Sidebar */}
      <div className="w-48 bg-neutral-950 border-l border-neutral-900 p-3 hidden lg:block">
        <div className="text-[10px] text-neutral-600 tracking-wider mb-3">
          ONLINE — {onlineUsers.length}
        </div>
        <div className="space-y-1">
          {onlineUsers.length > 0 ? (
            onlineUsers.map((username, index) => (
              <div
                key={`${username}-${index}`}
                className="flex items-center gap-2 p-1.5 rounded hover:bg-neutral-900 transition-colors"
              >
                <div className="relative">
                  <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-neutral-500">{username.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-neutral-950 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-neutral-400 truncate">
                    {username}
                  </div>
                  <div className="text-[9px] text-emerald-500">Online</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-[10px] text-neutral-700 py-2">No users online</div>
          )}
        </div>

        {!isConnected && (
          <div className="mt-4 p-2 bg-red-950/20 border border-red-900/30 rounded">
            <div className="text-[10px] text-red-500 text-center">
              Disconnected from server
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
