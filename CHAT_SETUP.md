# Real-time Chat Setup Guide

This dashboard now includes a real-time chat feature powered by Socket.io. Both the frontend and backend are now integrated into a single project for easy development!

## Features

- **Real-time messaging** across 4 channels: `general`, `ops`, `intel`, and `ai-lab`
- **Live user presence** - see who's online in each channel
- **Channel switching** - seamlessly switch between channels
- **Message history** - automatic message history on channel join
- **Connection status** - visual indicators for connection state
- **Auto-reconnection** - automatically reconnects if connection is lost

## Architecture

### Frontend (Dashboard)
- **Location**: `/src/components/dashboard/chat-page.tsx`
- **Hook**: `/src/lib/hooks/useSocketChat.ts`
- **Technology**: Socket.io Client + React

### Backend (Server)
- **Location**: `/server/server.js`
- **Technology**: Socket.io Server + Express
- **Port**: 3001 (default)

## Quick Start (One Command!)

### Start Both Frontend & Backend Together

```bash
npm run dev
```

This single command will:
1. Install server dependencies automatically
2. Start the Socket.io server on port 3001
3. Start the Next.js frontend on port 3000
4. Display logs from both with color-coded prefixes

You should see output like:
```
[SERVER] ╔═══════════════════════════════════════╗
[SERVER] ║     💀 DedSec Server Online 💀       ║
[SERVER] ╠═══════════════════════════════════════╣
[SERVER] ║  Port: 3001                          ║
[SERVER] ║  Status: ACTIVE                       ║
[SERVER] ║  Socket.io: READY                     ║
[SERVER] ╚═══════════════════════════════════════╝
[CLIENT] ▲ Next.js 14.2.33
[CLIENT] - Local:        http://localhost:3000
```

### Alternative: Run Separately

If you prefer to run them separately:

**Terminal 1 - Server:**
```bash
npm run server
```

**Terminal 2 - Client:**
```bash
npm run client
```

## Test the Chat

1. Open the dashboard at `http://localhost:3000`
2. Log in with your credentials
3. Navigate to the Chat section (sidebar or press `~` and select "Open Team Chat")
4. You should see the connection indicator turn green (WiFi icon)
5. Try sending a message!
6. Open another browser window to test multi-user chat

## Socket.io Events

The chat implements the following Socket.io events (matching your server.js):

### Client → Server
- `user:join` - User joins a channel
  ```js
  { username: string, channel: ChatChannel }
  ```
- `channel:switch` - User switches channels
  ```js
  { channel: ChatChannel }
  ```
- `message:send` - Send a message
  ```js
  { channel: ChatChannel, content: string }
  ```

### Server → Client
- `messages:history` - Receive message history on join
  ```js
  SocketChatMessage[]
  ```
- `message:new` - New message broadcast
  ```js
  { id: number, username: string, content: string, channel: string, timestamp: string }
  ```
- `users:list` - Updated list of online users
  ```js
  string[]
  ```
- `user:joined` - User joined notification
  ```js
  { username: string, timestamp: string }
  ```
- `user:left` - User left notification
  ```js
  { username: string, timestamp: string }
  ```

## Troubleshooting

### Connection Issues

**Problem**: Chat shows "DISCONNECTED FROM SERVER"

**Solutions**:
1. Verify the Socket.io server is running on port 3001
2. Check the console for connection errors
3. Ensure `NEXT_PUBLIC_SOCKET_URL` is correctly set in `.env.local`
4. Check for CORS issues (server already configured for localhost)

### Messages Not Appearing

**Problem**: Messages sent but not visible

**Solutions**:
1. Check browser console for errors
2. Verify you're in the correct channel
3. Try refreshing the page to reconnect
4. Check server logs for message handling errors

### Multiple Users Testing

To test with multiple users:
1. Open the dashboard in multiple browser windows/tabs
2. Log in with different accounts (or use incognito mode)
3. All users should see each other in the online users list
4. Messages should appear in real-time for all users in the same channel

## Production Deployment

For production:

1. **Deploy the Socket.io Server**:
   - Use a service like Heroku, Railway, or DigitalOcean
   - Set environment variables for production
   - Update CORS settings in server.js to include your production domain

2. **Update Dashboard Environment**:
   ```env
   NEXT_PUBLIC_SOCKET_URL=https://your-production-server.com
   ```

3. **Enable SSL/TLS**:
   - Use HTTPS for production
   - Socket.io will automatically upgrade to WSS (WebSocket Secure)

## File Structure

```
src/
├── components/
│   └── dashboard/
│       └── chat-page.tsx          # Main chat UI component
├── lib/
│   └── hooks/
│       └── useSocketChat.ts       # Socket.io chat hook
└── types/
    └── chat.ts                    # Chat type definitions
```

## Next Steps

- Add emoji picker functionality
- Implement file attachments
- Add message reactions
- Implement typing indicators
- Add message search
- Enable message editing/deletion (server support needed)

---

**Note**: The chat also has a Firestore fallback implementation in `/src/lib/db/chat.ts`, but the Socket.io version provides true real-time communication and is the recommended approach.
