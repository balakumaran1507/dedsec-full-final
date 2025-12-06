# 🧪 Testing Guide for DedSec CTF Dashboard

## 📋 Prerequisites

1. **Firebase Setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password, Google, GitHub)
   - Create a Firestore database (start in test mode)
   - Get your Firebase config from Project Settings

2. **Environment Variables**
   Create `.env.local` file:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

---

## 🚀 Step-by-Step Testing Process

### **Step 1: Create Your First User**

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Click "Sign Up" and create an account:
   - Email: `admin@dedsec.com`
   - Password: `SecurePassword123!`
   - Display Name: `DedSec Admin`

4. **IMPORTANT**: Make this user an admin:
   - Go to Firebase Console > Firestore Database
   - Find the `users` collection
   - Find your user document
   - Edit the `role` field from `member` to `founder`

---

### **Step 2: Add Test Data (Option A - Manual)**

**Via Firebase Console:**

1. Go to Firestore Database
2. Create documents in each collection:

**CTF Events:**
```javascript
// Collection: ctf_events
{
  ctftimeId: 2001,
  title: "DiceCTF 2024",
  description: "Premier CTF competition",
  url: "https://ctf.dicega.ng/",
  weight: 85.50,
  format: "Jeopardy",
  startDate: (select Timestamp, pick a future date),
  endDate: (select Timestamp, pick date after start),
  duration: 2,
  organizers: [{id: 1, name: "DiceGang"}],
  status: "upcoming",
  difficulty: "Hard",
  interestedMembers: [],
  createdAt: (auto),
  updatedAt: (auto)
}
```

**Writeups:**
```javascript
// Collection: writeups
{
  title: "SQL Injection in Login",
  challengeName: "Easy Login",
  ctfName: "DiceCTF 2024",
  category: "Web",
  difficulty: "Easy",
  content: "## Solution\nUsed SQL injection...",
  tags: ["sql", "web"],
  authorUid: "YOUR_USER_ID", // Copy from users collection
  authorName: "DedSec Admin",
  date: (select Timestamp, now),
  upvotes: 10,
  upvotedBy: [],
  hotScore: 100
}
```

**Chat Messages:**
```javascript
// Collection: chat_messages/general/messages
{
  channel: "general",
  senderId: "YOUR_USER_ID",
  senderName: "DedSec Admin",
  senderRole: "founder",
  content: "Welcome to DedSec!",
  timestamp: (select Timestamp, now)
}
```

**Announcements:**
```javascript
// Collection: announcements
{
  title: "Welcome to DedSec!",
  content: "We're excited to have you here.",
  author: "Admin",
  authorUid: "YOUR_USER_ID",
  type: "info",
  pinned: true,
  createdAt: (select Timestamp, now)
}
```

---

### **Step 2: Add Test Data (Option B - Script)**

1. Install ts-node:
   ```bash
   npm install -D ts-node @types/node
   ```

2. Update `scripts/seed-test-data.ts`:
   - Replace `YOUR_USER_ID` with your actual Firebase user ID
   - Find your user ID in Firebase Console > Authentication > Users

3. Add script to `package.json`:
   ```json
   {
     "scripts": {
       "seed": "ts-node --project tsconfig.json scripts/seed-test-data.ts"
     }
   }
   ```

4. Run the seeding script:
   ```bash
   npm run seed
   ```

---

### **Step 3: Sync CTFTime Events**

1. Log in as admin user
2. Navigate to **Operations** page
3. Click **"🔄 SYNC CTFTIME"** button
4. Wait for sync to complete (should show alert with results)
5. Refresh the page to see upcoming CTFs

**Note:** CTFTime API has rate limits. Don't sync too frequently!

---

## 🧪 Testing Checklist

### ✅ **Authentication**
- [ ] Sign up with email/password
- [ ] Log in with existing account
- [ ] Log out successfully
- [ ] User info appears in sidebar

### ✅ **Profile Page**
- [ ] View profile with stats
- [ ] Edit profile (bio, social links)
- [ ] Changes persist after refresh
- [ ] Badges display correctly

### ✅ **Command Center**
- [ ] User rank displays
- [ ] Contribution score shows
- [ ] Ongoing CTF events appear
- [ ] Team metrics load

### ✅ **Agent Network**
- [ ] Team members list loads
- [ ] Search by name works
- [ ] Filter by role works
- [ ] Click member shows details

### ✅ **Operations (CTF Events)**
- [ ] Events list displays
- [ ] Tab filtering works (upcoming/live/complete)
- [ ] **ADMIN:** Sync CTFTime button appears
- [ ] **ADMIN:** CTFTime sync works
- [ ] **ADMIN:** Create event modal opens
- [ ] **ADMIN:** Can create custom event

### ✅ **Intelligence (Writeups)**
- [ ] Writeups list displays
- [ ] Category filtering works
- [ ] Search functionality works
- [ ] Create writeup modal opens
- [ ] Can submit new writeup
- [ ] Writeup appears in list

### ✅ **Systems (Rankings)**
- [ ] Leaderboard displays
- [ ] User rank shown in cards
- [ ] Search team members works
- [ ] Update stats button works

### ✅ **Real-time Chat**
- [ ] Messages load in channel
- [ ] Can switch channels
- [ ] Can send message
- [ ] Message appears immediately
- [ ] **Real-time:** Open in 2 browsers, messages sync

### ✅ **Announcements**
- [ ] Announcements list displays
- [ ] Pinned announcements separate
- [ ] Click announcement shows details
- [ ] **ADMIN:** Create button appears
- [ ] **ADMIN:** Can create announcement
- [ ] Type indicators work (info/urgent/success)

---

## 🐛 Common Issues & Solutions

### **Issue: "Firebase operation timed out"**
**Solution:** Check your internet connection and Firebase rules

### **Issue: "User is null" or auth errors**
**Solution:** Clear browser cache, logout and login again

### **Issue: "Permission denied" in Firestore**
**Solution:** Update Firestore rules to allow read/write:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **Issue: CTFTime sync not working**
**Solution:**
- Check browser console for CORS errors
- CTFTime API might be down or rate-limited
- Try again after a few minutes

### **Issue: No data showing**
**Solution:**
- Check Firestore collections exist
- Verify data was added correctly
- Check browser console for errors

---

## 📊 Firestore Structure

```
firestore/
├── users/                    # User profiles
│   └── {uid}/
├── ctf_events/              # CTF competitions
│   └── {eventId}/
├── writeups/                # Challenge writeups
│   └── {writeupId}/
├── chat_messages/           # Chat system
│   ├── general/
│   │   └── messages/
│   ├── operations/
│   │   └── messages/
│   └── writeups/
│       └── messages/
└── announcements/           # Team announcements
    └── {announcementId}/
```

---

## 🎯 Next Steps After Testing

1. **Configure Firestore Security Rules** (production-ready)
2. **Set up Firebase Storage** (for file uploads)
3. **Configure Firebase Functions** (for automated tasks)
4. **Add more test users** (simulate team)
5. **Test performance** with larger datasets

---

## 🚀 Production Deployment

When ready for production:

1. **Update Firestore Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read: if request.auth != null;
         allow write: if request.auth.uid == userId;
       }

       match /ctf_events/{eventId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null &&
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'founder'];
       }

       match /writeups/{writeupId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null;
         allow update, delete: if request.auth != null &&
           resource.data.authorUid == request.auth.uid;
       }

       match /announcements/{announcementId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null &&
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'founder'];
       }

       match /chat_messages/{channel}/messages/{messageId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null;
       }
     }
   }
   ```

2. **Deploy to Vercel:**
   ```bash
   npm run build
   vercel deploy --prod
   ```

3. **Set up scheduled CTFTime sync** (Firebase Functions or cron job)

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Firebase configuration
3. Review Firestore rules
4. Check network requests in DevTools
