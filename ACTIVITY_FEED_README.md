# 🎯 Activity Feed & CTFTime Integration - Quick Start

This guide covers the new **Activity Feed** system and **CTFTime Team Integration** added to your DedSec CTF Dashboard.

---

## ✨ What's New

### 1. **Real-time Activity Feed**
- Displays team activities as they happen
- Shows writeups created, CTF participations, announcements, and more
- Auto-updates in real-time using Firestore subscriptions
- Beautiful animated UI with role-based coloring

### 2. **CTFTime Team Integration**
- Fetches your team's rating and rank from CTFTime
- Displays current year statistics
- Shows country and global ranking
- Direct link to your CTFTime team page

---

## 🚀 Quick Setup

### **Step 1: Install Dependencies (if needed)**

```bash
npm install -D ts-node @types/node
```

### **Step 2: Set Up Test Data**

1. **First, seed your main test data** (CTF events, writeups, etc.):
   ```bash
   npm run seed
   ```

   > ⚠️ **IMPORTANT**: Replace `YOUR_USER_ID` in `scripts/seed-test-data.ts` with your actual Firebase user ID first!

2. **Then, seed activity feed data**:
   ```bash
   npm run seed:activity
   ```

   > ⚠️ **IMPORTANT**: Replace `YOUR_USER_ID` in `scripts/seed-activity-data.ts` with your actual Firebase user ID!

### **Step 3: Start Development Server**

```bash
npm run dev
```

Navigate to **Command Center** (`http://localhost:3000/dashboard/command-center`) to see:
- **Activity Feed** - Real-time team activities in the left panel
- **CTFTime Stats** - Your team's rating and rank in the right "TEAM STATS" card

---

## 📊 Features Overview

### **Activity Feed Component**

**Location:** Command Center page (left panel, replacing "SOLVE FEED")

**What it shows:**
- 👤 **Member Joined**: New team members joining
- 📝 **Writeup Created**: New writeups with category badges
- 🎯 **CTF Joined**: Members participating in CTFs
- 📢 **Announcement Created**: New team announcements
- 🏆 **Challenge Solved**: (future) Individual challenge solves
- ✨ **Achievement Unlocked**: (future) Badge/achievement unlocks

**Features:**
- Real-time updates (no refresh needed)
- Beautiful animations
- Role-based user name colors (Founder: red, Admin: purple, Member: green)
- Relative timestamps ("2m ago", "1h ago", etc.)
- Category badges for writeups
- Hover effects and smooth transitions

---

### **CTFTime Team Stats**

**Location:** Command Center page (right panel, "TEAM STATS" card)

**What it shows:**
- 🌟 **Current Year Rating**: Your team's rating for 2024
- 🏆 **Global Rank**: Position on CTFTime leaderboard
- 🌍 **Country**: Team location
- 🔗 **Link**: Direct link to your CTFTime team page

**Team Link:** https://ctftime.org/team/409848

---

## 🔧 How It Works

### **Activity Feed Architecture**

1. **Automatic Logging**: Activities are automatically logged when:
   - User creates a writeup → `logWriteupCreated()`
   - User creates an announcement → `logAnnouncementCreated()`
   - More actions can be added easily!

2. **Firestore Collection**: `activity_feed`
   ```
   activity_feed/
   ├── {activityId1}/
   │   ├── type: "writeup_created"
   │   ├── userId: "user123"
   │   ├── userName: "Admin"
   │   ├── userRole: "founder"
   │   ├── content: "Admin wrote a Web writeup..."
   │   ├── metadata: { category, writeupId, etc. }
   │   └── timestamp: Timestamp
   └── {activityId2}/...
   ```

3. **Real-time Subscription**: Uses `onSnapshot()` to listen for new activities

4. **Smart UI**: Component automatically handles:
   - Loading states
   - Empty states
   - Smooth animations
   - Timestamp formatting

---

### **CTFTime Integration Architecture**

1. **API Service**: `src/lib/api/ctftimeTeam.ts`
   - Fetches data from CTFTime API
   - Parses team information
   - Formats for dashboard display

2. **Next.js API Route**: `/api/team-stats`
   - Server-side proxy to avoid CORS issues
   - Caches data appropriately
   - Returns formatted JSON

3. **Command Center Integration**:
   - Fetches on page load
   - Displays in TEAM STATS card
   - Gracefully handles failures

---

## 🎨 Customization

### **Change Your CTFTime Team ID**

Edit `src/lib/api/ctftimeTeam.ts`:
```typescript
const TEAM_ID = 409848; // Change this to your team ID
```

### **Adjust Activity Feed Size**

In Command Center page:
```tsx
<ActivityFeed maxItems={8} showTitle={false} />
//            ↑ Change this number
```

### **Add Custom Activity Types**

1. Add to `src/types/activity.ts`:
   ```typescript
   export type ActivityType =
     | 'writeup_created'
     | 'your_new_type'  // Add here
     | ...
   ```

2. Add icon in `activity-feed.tsx`:
   ```typescript
   const getActivityIcon = (type) => {
     case 'your_new_type':
       return <YourIcon className="w-4 h-4" />;
   }
   ```

3. Create helper in `activityFeed.ts`:
   ```typescript
   export async function logYourNewActivity(
     userId: string,
     userName: string,
     // ... other params
   ) {
     await createActivity({
       type: 'your_new_type',
       // ... other fields
     });
   }
   ```

4. Call it where needed:
   ```typescript
   import { logYourNewActivity } from '@/lib/db/activityFeed';

   // In your feature code
   await logYourNewActivity(user.uid, user.displayName, ...);
   ```

---

## 📝 Activity Types Reference

| Type | Description | When it triggers |
|------|-------------|------------------|
| `writeup_created` | New writeup posted | User submits writeup |
| `ctf_joined` | User joins CTF | User indicates interest |
| `challenge_solved` | Challenge completed | User submits correct flag |
| `achievement_unlocked` | Badge earned | Achievement criteria met |
| `member_joined` | New team member | User signs up |
| `ctf_completed` | CTF finished | CTF end time reached |
| `announcement_created` | New announcement | Admin posts announcement |

---

## 🐛 Troubleshooting

### **Activity Feed shows "No recent activity"**

**Solutions:**
1. Run the seed script: `npm run seed:activity`
2. Create a writeup or announcement manually
3. Check Firebase Console → Firestore → `activity_feed` collection exists
4. Check browser console for errors

### **CTFTime stats not showing**

**Solutions:**
1. Check your team ID in `src/lib/api/ctftimeTeam.ts`
2. Verify CTFTime.org is accessible (not blocked/rate-limited)
3. Check browser console Network tab for API errors
4. Try accessing: `http://localhost:3000/api/team-stats` directly

### **Activities not updating in real-time**

**Solutions:**
1. Check Firestore rules allow real-time subscriptions
2. Verify user is authenticated
3. Check browser console for subscription errors
4. Clear browser cache and reload

---

## 🔐 Firestore Security Rules

Update your Firestore rules to allow activity feed access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Activity feed - authenticated users can read
    match /activity_feed/{activityId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if false; // Activities are immutable
    }
  }
}
```

---

## 📦 Files Added/Modified

### **New Files:**
- `src/types/activity.ts` - Activity types and interfaces
- `src/lib/db/activityFeed.ts` - Firestore service for activities
- `src/lib/api/ctftimeTeam.ts` - CTFTime API integration
- `src/components/dashboard/activity-feed.tsx` - Activity feed UI component
- `src/app/api/team-stats/route.ts` - API route for team stats
- `scripts/seed-activity-data.ts` - Activity data seeding script
- `ENHANCEMENT_RECOMMENDATIONS.md` - Future feature ideas
- `ACTIVITY_FEED_README.md` - This file

### **Modified Files:**
- `src/lib/db/writeups.ts` - Added activity logging on writeup creation
- `src/lib/db/announcements.ts` - Added activity logging on announcement creation
- `src/app/(dashboard)/dashboard/command-center/page.tsx` - Integrated activity feed and CTFTime stats
- `package.json` - Added seed scripts

---

## 🎯 Next Steps

Now that you have Activity Feed and CTFTime integration working, consider implementing:

1. **CTF Participation Tracking** (see `ENHANCEMENT_RECOMMENDATIONS.md`)
   - Track who's joining each CTF
   - Log activities when users express interest

2. **Challenge Submission System**
   - Track flag submissions
   - Log activities for successful solves

3. **Achievements System**
   - Define badges
   - Log activities when badges are unlocked

4. **Analytics Dashboard**
   - Visualize activity over time
   - Team engagement metrics

Check `ENHANCEMENT_RECOMMENDATIONS.md` for detailed implementation plans!

---

## 🤝 Contributing Activities

When you add new features, remember to log activities:

```typescript
// Example: Adding activity logging to a new feature
import { createActivity } from '@/lib/db/activityFeed';

async function yourNewFeature(user) {
  // ... your feature code ...

  // Log the activity
  await createActivity({
    type: 'your_activity_type',
    userId: user.uid,
    userName: user.displayName,
    userRole: user.role,
    content: `${user.displayName} did something cool`,
    metadata: {
      // Any extra data
    }
  });
}
```

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Firestore rules are correct
3. Ensure user is authenticated
4. Check network requests in DevTools
5. Review `TESTING_GUIDE.md` for common issues

---

**Happy Hacking! 🔥**

*DedSec CTF Dashboard v1.0*
