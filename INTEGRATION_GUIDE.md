# Integration Guide: Connecting UI to Firebase Logic

## ✅ What's Already Done

I've built the complete backend logic layer:
- ✅ Firebase initialization
- ✅ All TypeScript types
- ✅ 5 complete Firestore services (user, writeups, CTF events, chat, admin)
- ✅ Authentication system with `useAuth` hook
- ✅ API routes
- ✅ Client-side data hooks (`useProfile`, `useWriteups`)
- ✅ Firestore security rules

## 🔌 What Needs Integration

Your existing UI pages have **mock data** that needs to be replaced with **real Firebase calls**. Here's the mapping:

| Existing Page | Mock Data | Replace With |
|---------------|-----------|--------------|
| `profile-page.tsx` | Hardcoded stats | `useProfile` hook + real user data |
| `chat-page.tsx` | Static messages | Real-time Firestore chat |
| `admin-page.tsx` | Mock members/requests | Admin service + API calls |
| `intelligence/page.tsx` | No data | `useWriteups` hook |
| `operations/page.tsx` | No data | CTF Events API |
| `agent-network/page.tsx` | No data | Team members from Firestore |
| `systems/page.tsx` | No data | Leaderboard from Firestore |

---

## 📋 Integration Steps

### 1. Profile Page (`components/dashboard/profile-page.tsx`)

**Current:** Hardcoded mock data
**Replace with:** Real Firebase data using `useProfile` hook

#### Before (Mock Data):
```typescript
const solveHistory = [
  { month: "JUL", solves: 12 },
  // ...hardcoded
]
```

#### After (Real Data):
```typescript
'use client';

import { useAuth } from '@/lib/auth/useAuth';
import { useProfile } from '@/lib/hooks/useProfile';
import { getTitleName, getNextTitle, getTitleProgress } from '@/lib/utils/ranking';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, recentWriteups, loading } = useProfile();

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  const nextTitle = getNextTitle(profile.contributionScore);
  const progress = getTitleProgress(profile.contributionScore);

  return (
    <div className="p-4 space-y-4">
      {/* Profile Header */}
      <div className="flex items-start gap-6 p-4 bg-neutral-950 border border-neutral-900 rounded">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl text-neutral-100 tracking-wider">{profile.displayName}</h2>
            <span className="text-[10px] px-2 py-0.5 bg-red-950/50 text-red-500 rounded border border-red-900/50">
              {profile.role.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] text-neutral-500">
            <span>TITLE: {profile.title} ({getTitleName(profile.title)})</span>
            <span>|</span>
            <span>RANK: #{profile.rank}</span>
            <span>|</span>
            <span>SCORE: {profile.contributionScore}</span>
          </div>
        </div>
      </div>

      {/* Stats Row - USE REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-3">
            <p className="text-lg text-neutral-100">{profile.stats.writeupCount}</p>
            <p className="text-[10px] text-neutral-600">WRITEUPS</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-lg text-neutral-100">{profile.stats.totalUpvotes}</p>
            <p className="text-[10px] text-neutral-600">UPVOTES</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-lg text-neutral-100">{profile.stats.ctfParticipation}</p>
            <p className="text-[10px] text-neutral-600">CTFs JOINED</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Writeups - USE REAL DATA */}
      <Card>
        <CardHeader>
          <CardTitle>RECENT WRITEUPS</CardTitle>
        </CardHeader>
        <CardContent>
          {recentWriteups.map((writeup) => (
            <div key={writeup.id}>
              <div className="text-xs text-neutral-300">{writeup.title}</div>
              <div className="text-[10px] text-neutral-600">{writeup.category}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Badges - USE REAL DATA */}
      <Card>
        <CardHeader>
          <CardTitle>BADGES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {profile.badges.map((badge) => (
              <div key={badge.id} className="p-3 rounded border bg-neutral-900">
                <Award className="w-5 h-5 mx-auto mb-1.5 text-neutral-400" />
                <div className="text-[9px] text-neutral-300">{badge.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### 2. Chat Page (`components/dashboard/chat-page.tsx`)

**Current:** Static messages in state
**Replace with:** Real-time Firestore subscriptions

#### Add Real-time Chat:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import {
  sendMessage,
  subscribeToMessages,
  subscribeToOnlineUsers,
  updateUserPresence
} from '@/lib/db/chat';
import { ChatChannel, ChatMessage, UserPresence } from '@/types/chat';

export default function ChatPage() {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState<ChatChannel>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Subscribe to messages
  useEffect(() => {
    const unsubscribe = subscribeToMessages(activeChannel, setMessages);
    return () => unsubscribe();
  }, [activeChannel]);

  // Subscribe to online users
  useEffect(() => {
    const unsubscribe = subscribeToOnlineUsers(activeChannel, setOnlineUsers);
    return () => unsubscribe();
  }, [activeChannel]);

  // Update presence when channel changes
  useEffect(() => {
    if (user) {
      updateUserPresence(
        user.uid,
        user.displayName,
        activeChannel,
        user.photoURL,
        user.title
      );
    }
  }, [activeChannel, user]);

  const sendMsg = async () => {
    if (!inputValue.trim() || !user) return;

    await sendMessage({
      channel: activeChannel,
      userId: user.uid,
      username: user.displayName,
      userPhotoURL: user.photoURL,
      userTitle: user.title,
      content: inputValue,
    });

    setInputValue("");
  };

  return (
    <div className="flex h-full">
      {/* Messages */}
      <div className="flex-1">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3">
            <span className="text-xs text-neutral-300">{msg.username}</span>
            <p className="text-sm text-neutral-400">{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Online Users Sidebar */}
      <div className="w-48 border-l border-neutral-900">
        <div className="text-[10px] text-neutral-600">
          ONLINE — {onlineUsers.length}
        </div>
        {onlineUsers.map((presence) => (
          <div key={presence.userId}>
            {presence.username}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 3. Admin Page (`components/dashboard/admin-page.tsx`)

**Current:** Mock members/requests
**Replace with:** Real admin API calls

#### Add Real Admin Data:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { JoinRequest } from '@/types/admin';

export default function AdminPage() {
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetch('/api/admin/join-requests?status=pending');
      const data = await response.json();
      if (data.success) {
        setPendingRequests(data.joinRequests);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const approveRequest = async (requestId: string, adminUid: string) => {
    const response = await fetch('/api/admin/join-requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: requestId,
        action: 'approve',
        reviewedBy: adminUid,
      }),
    });

    if (response.ok) {
      // Refresh list
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>JOIN REQUESTS</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.map((request) => (
            <div key={request.id} className="flex justify-between">
              <div>
                <div className="text-xs">{request.name}</div>
                <div className="text-[10px] text-neutral-600">{request.email}</div>
              </div>
              <Button onClick={() => approveRequest(request.id, currentUser.uid)}>
                APPROVE
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### 4. Intelligence Page (Writeups)

**Current:** Empty placeholder
**Replace with:** Writeups list using `useWriteups` hook

#### Create Writeups Page:
```typescript
'use client';

import { useState } from 'react';
import { useWriteups, useUpvoteWriteup } from '@/lib/hooks/useWriteups';
import { useAuth } from '@/lib/auth/useAuth';
import { WriteupCategory } from '@/types/writeup';

export default function IntelligencePage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<WriteupCategory | undefined>();
  const [sortBy, setSortBy] = useState<'hot' | 'date' | 'upvotes'>('hot');

  const { writeups, loading } = useWriteups({
    category: selectedCategory,
    sortBy,
    limit: 50,
  });

  const { upvote, removeUpvote, upvoting } = useUpvoteWriteup();

  const handleUpvote = async (writeupId: string, hasUpvoted: boolean) => {
    if (!user) return;

    if (hasUpvoted) {
      await removeUpvote(writeupId, user.uid);
    } else {
      await upvote(writeupId, user.uid);
    }

    // Refresh list
    window.location.reload(); // Or use state management
  };

  if (loading) return <div>Loading writeups...</div>;

  return (
    <div className="p-4">
      {/* Category Tabs */}
      <div className="flex gap-2 mb-4">
        {['Web', 'Crypto', 'Pwn', 'Rev', 'Forensics'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat as WriteupCategory)}
            className={selectedCategory === cat ? 'active' : ''}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Writeups List */}
      <div className="space-y-4">
        {writeups.map((writeup) => (
          <Card key={writeup.id}>
            <CardHeader>
              <CardTitle>{writeup.title}</CardTitle>
              <p className="text-xs text-neutral-600">
                by {writeup.author.displayName} | {writeup.category}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{writeup.content.substring(0, 200)}...</p>
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => handleUpvote(writeup.id, writeup.upvotedBy.includes(user?.uid || ''))}
                  disabled={upvoting}
                >
                  ▲ {writeup.upvotes}
                </button>
                <a href={`/dashboard/writeups/${writeup.id}`}>Read More →</a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

### 5. Operations Page (CTF Events)

**Current:** Empty placeholder
**Replace with:** CTF events from API

#### Add CTF Events:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { CTFEvent } from '@/types/ctf';
import { useAuth } from '@/lib/auth/useAuth';

export default function OperationsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CTFEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch('/api/ctftime/upcoming?limit=20');
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const toggleInterest = async (eventId: string) => {
    // TODO: Create API endpoint for toggling interest
    // For now, use Firestore directly:
    // import { toggleUserInterest } from '@/lib/db/ctfEvents';
    // await toggleUserInterest(eventId, user.uid);
  };

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">UPCOMING CTF EVENTS</h2>
      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <p className="text-xs">
                {event.startDate.toString()} - {event.duration} days
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{event.description}</p>
              <Button onClick={() => toggleInterest(event.id)}>
                {event.interestedMembers.includes(user?.uid || '')
                  ? 'Leave'
                  : 'Join'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔧 Quick Integration Checklist

For EACH existing page:

1. **Add imports:**
   ```typescript
   import { useAuth } from '@/lib/auth/useAuth';
   import { appropriate hook or service } from '@/lib/...';
   ```

2. **Replace mock data with hooks:**
   ```typescript
   // Before:
   const members = [hardcoded];

   // After:
   const { user } = useAuth();
   const { profile, loading } = useProfile();
   ```

3. **Add loading states:**
   ```typescript
   if (loading) return <div>Loading...</div>;
   if (!data) return <div>Not found</div>;
   ```

4. **Connect buttons to API calls:**
   ```typescript
   const handleAction = async () => {
     await fetch('/api/...', { method: 'POST', body: ... });
   };
   ```

---

## 🚀 Next Steps

1. **Install Firebase:** `npm install` (already added to package.json)
2. **Configure .env.local:** Add your Firebase config
3. **Test auth:** Try logging in
4. **Update one page at a time:** Start with profile, then chat, then admin
5. **Test each integration** before moving to next page

---

## 📖 Available Hooks & Services

### Hooks (Client-side):
- `useAuth()` - Current user, auth methods
- `useProfile(uid?)` - User profile data
- `useWriteups(filters?)` - List of writeups
- `useWriteup(id)` - Single writeup
- `useUpvoteWriteup()` - Upvote/downvote methods

### Services (Import directly):
- `@/lib/db/user` - All user operations
- `@/lib/db/writeups` - All writeup operations
- `@/lib/db/ctfEvents` - CTF event operations
- `@/lib/db/chat` - Chat operations (real-time)
- `@/lib/db/admin` - Admin operations

### API Routes:
- `GET /api/writeups` - List writeups
- `GET /api/writeups/[id]` - Get writeup
- `POST /api/writeups` - Create writeup
- `POST /api/writeups/[id]/upvote` - Upvote
- `GET /api/ctftime/upcoming` - Upcoming CTFs
- `GET /api/admin/join-requests` - Join requests
- `PUT /api/admin/join-requests` - Approve/reject

---

**You now have everything needed to connect your beautiful UI to the real Firebase backend!**

Each existing page just needs its mock data replaced with the appropriate hooks/API calls shown above.
