/**
 * Socket.io Real-time Chat Hook
 *
 * Connects to the Socket.io server and provides real-time chat functionality
 * matching the server logic from server.js
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatChannel, ChatMessage } from '@/types/chat';

// Socket.io server URL - default to localhost:3001 if not set
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

interface SocketChatMessage {
  id: number;
  username: string;
  content: string;
  channel: ChatChannel;
  timestamp: string;
}

interface UserJoinedEvent {
  username: string;
  timestamp: string;
}

interface UserLeftEvent {
  username: string;
  timestamp: string;
}

export interface UseSocketChatOptions {
  username: string;
  initialChannel?: ChatChannel;
  autoConnect?: boolean;
}

export function useSocketChat({
  username,
  initialChannel = 'general',
  autoConnect = true
}: UseSocketChatOptions) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<ChatChannel>(initialChannel);
  const [messages, setMessages] = useState<SocketChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  /**
   * Initialize Socket.io connection
   */
  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log('Socket already connected');
      return;
    }

    setIsConnecting(true);
    console.log(`🔌 Connecting to Socket.io server at ${SOCKET_URL}...`);

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection established
    newSocket.on('connect', () => {
      console.log('✓ Socket.io connected:', newSocket.id);
      setIsConnected(true);
      setIsConnecting(false);

      // Join the initial channel
      newSocket.emit('user:join', { username, channel: currentChannel });
    });

    // Connection error
    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket.io connection error:', error.message);
      setIsConnecting(false);
    });

    // Disconnection
    newSocket.on('disconnect', (reason) => {
      console.log('✗ Socket.io disconnected:', reason);
      setIsConnected(false);
    });

    // Receive message history when joining a channel
    newSocket.on('messages:history', (history: SocketChatMessage[]) => {
      console.log(`📜 Received ${history.length} messages from history`);
      setMessages(history);
    });

    // Receive new message
    newSocket.on('message:new', (message: SocketChatMessage) => {
      console.log(`💬 New message from ${message.username}`);
      setMessages((prev) => [...prev, message]);
    });

    // User list update
    newSocket.on('users:list', (users: string[]) => {
      console.log(`👥 ${users.length} users online in channel`);
      setOnlineUsers(users);
    });

    // User joined notification
    newSocket.on('user:joined', (event: UserJoinedEvent) => {
      console.log(`✓ ${event.username} joined the channel`);
    });

    // User left notification
    newSocket.on('user:left', (event: UserLeftEvent) => {
      console.log(`✗ ${event.username} left the channel`);
    });

    return () => {
      newSocket.close();
    };
  }, [username, currentChannel]);

  /**
   * Disconnect from Socket.io
   */
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('🔌 Disconnecting from Socket.io...');
      socketRef.current.close();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  }, []);

  /**
   * Send a message to the current channel
   */
  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current?.connected) {
      console.error('Cannot send message: Socket not connected');
      return;
    }

    if (!content.trim()) {
      return;
    }

    console.log(`📤 Sending message to #${currentChannel}`);
    socketRef.current.emit('message:send', {
      channel: currentChannel,
      content: content.trim()
    });
  }, [currentChannel]);

  /**
   * Switch to a different channel
   */
  const switchChannel = useCallback((newChannel: ChatChannel) => {
    if (!socketRef.current?.connected) {
      console.error('Cannot switch channel: Socket not connected');
      return;
    }

    if (newChannel === currentChannel) {
      return;
    }

    console.log(`↔ Switching from #${currentChannel} to #${newChannel}`);
    socketRef.current.emit('channel:switch', { channel: newChannel });
    setCurrentChannel(newChannel);
    setMessages([]); // Clear messages, new history will arrive
  }, [currentChannel]);

  /**
   * Auto-connect on mount if enabled
   */
  useEffect(() => {
    if (autoConnect && username) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, username]);

  return {
    // Connection state
    socket,
    isConnected,
    isConnecting,

    // Chat state
    currentChannel,
    messages,
    onlineUsers,

    // Actions
    connect,
    disconnect,
    sendMessage,
    switchChannel,
  };
}
