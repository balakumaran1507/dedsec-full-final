# DedSec CTF Platform - Deployment Guide

Complete guide for deploying the DedSec CTF Platform to production using Vercel (frontend) and Render (backend).

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier works)
- Render account (free tier works)
- Firebase project with:
  - Authentication enabled
  - Firestore enabled
  - Service account credentials

---

## 🚀 Part 1: Deploy Backend (Socket.io Server) to Render

### Step 1: Prepare Backend for Deployment

The backend is already configured in the `server/` directory.

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

```
Name: dedsec-server
Region: Choose closest to your users
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: node server.js
```

### Step 3: Set Environment Variables on Render

Add these environment variables in Render dashboard:

```bash
# Required
NODE_VERSION=18.17.0
PORT=10000

# Optional - Discord webhook
DISCORD_WEBHOOK_URL=your_discord_webhook_url

# Optional - Email notifications
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_gmail_app_password

# Optional - Frontend URL (add after deploying to Vercel)
CLIENT_URL=https://your-vercel-app.vercel.app
```

### Step 4: Add Firebase Service Account as Secret File

1. In Render dashboard, go to your service
2. Navigate to **Environment** tab
3. Click **Secret Files**
4. Add file:
   - Filename: `serviceAccount.json`
   - Contents: Paste your entire serviceAccount.json content

### Step 5: Deploy

Click **Create Web Service** and wait for deployment to complete.

Your backend will be available at: `https://dedsec-server.onrender.com`

---

## 🎨 Part 2: Deploy Frontend (Next.js) to Vercel

### Step 1: Update Environment Variables

Create/update `.env.production`:

```bash
# Firebase Configuration (same as .env.local)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dedsec-5eae5
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Socket.io Server URL (UPDATE THIS AFTER RENDER DEPLOYMENT!)
NEXT_PUBLIC_SOCKET_URL=https://dedsec-server.onrender.com
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set project name: dedsec-ctf-platform
# - Deploy
```

#### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Step 3: Add Environment Variables on Vercel

1. In project settings → **Environment Variables**
2. Add all variables from `.env.production`
3. Make sure to add for **Production**, **Preview**, and **Development**

### Step 4: Deploy

Click **Deploy** and wait for build to complete.

Your frontend will be available at: `https://your-project.vercel.app`

---

## 🔧 Part 3: Configure Firebase for Production

### Enable Email Link Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `dedsec-5eae5`
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password** provider
5. Enable **Email link (passwordless sign-in)**
6. Click **Save**

### Whitelist Production Domains

1. In Firebase Console → **Authentication** → **Settings**
2. Scroll to **Authorized domains**
3. Add your domains:
   - `your-project.vercel.app`
   - `dedsec-server.onrender.com`
4. Click **Add domain** for each

### Update Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Update rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAuthenticated() &&
        (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }

    // Chat messages
    match /chat_messages/{channel}/messages/{message} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() &&
        resource.data.userId == request.auth.uid;
    }

    // Announcements
    match /announcements/{announcement} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }

    // CTF Events
    match /ctf_events/{event} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }

    // Writeups
    match /writeups/{writeup} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() &&
        (resource.data.authorUid == request.auth.uid || isAdmin());
    }

    // Join requests
    match /join_requests/{request} {
      allow read: if isAdmin();
      allow create: if true; // Anyone can request to join
      allow update, delete: if isAdmin();
    }

    // User presence
    match /user_presence/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

---

## 🔐 Part 4: Post-Deployment Configuration

### Update CORS Settings

After both deployments, update the backend CORS settings:

1. In your code editor, open `server/server.js`
2. Update the `allowedOrigins` array:

```javascript
const allowedOrigins = [
  "https://your-project.vercel.app", // Your Vercel domain
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174"
];
```

3. Commit and push (this will auto-deploy on Render)

### Seed Production Database

After first deployment, seed the announcements:

```bash
curl -X POST https://dedsec-server.onrender.com/api/seed/announcements
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend loads at Vercel URL
- [ ] Can sign up / sign in with email/password
- [ ] Can sign in with Google OAuth
- [ ] Can sign in with GitHub OAuth
- [ ] Email link sign-in sends email (check spam)
- [ ] Chat connects to Socket.io server
- [ ] Chat messages persist after refresh
- [ ] Announcements tab shows 6 seeded announcements
- [ ] Can create new announcements as admin
- [ ] CTFTime events load
- [ ] Writeups page works

---

## 🐛 Troubleshooting

### Email Link Authentication Not Working

**Problem**: Email link sign-in doesn't send emails

**Solution**:
1. Check Firebase Console → Authentication → Sign-in method
2. Ensure **Email link (passwordless sign-in)** is enabled
3. Verify domain is whitelisted in **Authorized domains**
4. Check browser console for errors
5. Make sure the URL in `sendEmailLink` matches your production domain:

```typescript
// In useAuth.tsx, line 244
const actionCodeSettings = {
  url: `${window.location.origin}/auth/complete`, // This should work automatically
  handleCodeInApp: true,
};
```

**Additional Firebase Settings**:
1. Go to Firebase Console → Authentication → Templates
2. Click on **Email link sign-in template**
3. Verify the template looks correct
4. Test by sending yourself a link

### Chat Not Connecting

**Problem**: Chat shows "Disconnected"

**Solutions**:
1. Check `NEXT_PUBLIC_SOCKET_URL` environment variable
2. Verify Render service is running
3. Check Render logs for errors
4. Ensure CORS is configured with your Vercel domain

### Firebase Admin Not Initialized

**Problem**: Server shows "Firebase Admin initialization failed"

**Solutions**:
1. Verify `serviceAccount.json` is added as Secret File in Render
2. Check file path in server.js (should be `../serviceAccount.json`)
3. Check Render logs for specific error

### Build Fails on Vercel

**Problem**: Vercel build fails

**Solutions**:
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Make sure `package.json` has all dependencies
4. Try local build: `npm run build`

---

## 📊 Monitoring

### Render Logs

View backend logs:
1. Go to Render dashboard
2. Click on your service
3. Navigate to **Logs** tab

### Vercel Logs

View frontend logs:
1. Go to Vercel dashboard
2. Click on your project
3. Navigate to **Deployments** → Click deployment → **Functions**

### Firebase Usage

Monitor Firestore usage:
1. Firebase Console → Usage and billing
2. Check read/write operations
3. Firestore free tier: 50K reads, 20K writes per day

---

## 💰 Cost Estimates

### Free Tier Limits

**Vercel** (Free Hobby Plan):
- 100 GB bandwidth per month
- Unlimited deployments
- Custom domains

**Render** (Free Plan):
- 750 hours per month
- Sleeps after 15 min inactivity (wakes on request)
- 512 MB RAM

**Firebase** (Spark Plan):
- 50K document reads/day
- 20K document writes/day
- 1 GB storage
- 10 GB bandwidth/month

### When to Upgrade

- **Vercel**: If bandwidth > 100 GB/month → Pro ($20/mo)
- **Render**: If need always-on → Starter ($7/mo)
- **Firebase**: If exceed limits → Blaze (pay as you go)

---

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployment:

1. **Push to main branch** → Auto-deploys to production
2. **Push to other branches** → Vercel creates preview deployment
3. **Pull requests** → Vercel creates preview for testing

---

## 🎯 Performance Tips

### Frontend Optimization

1. Enable Vercel Analytics:
   - Project Settings → Analytics → Enable
   - Track Core Web Vitals

2. Enable Image Optimization:
   - Already configured in Next.js
   - Use `<Image>` component from `next/image`

### Backend Optimization

1. Keep Render awake:
   - Use a cron job to ping server every 10 minutes
   - Prevents cold starts

2. Implement Redis cache (if upgraded):
   - Cache CTFTime API responses
   - Cache user sessions

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review Render/Vercel logs
3. Check Firebase Console for errors
4. Verify all environment variables are set correctly

---

**Deployment Date**: December 7, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
