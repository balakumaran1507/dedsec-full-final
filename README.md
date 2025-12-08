# 💀 DedSec CTF Dashboard

A full-stack CTF (Capture The Flag) team dashboard with real-time chat, team management, event tracking, and writeup sharing.

## ✨ Features

### 🏠 Dashboard
- **Command Center** - Overview of team activity, upcoming events, and recent writeups
- **Team Network** - View all team members, their specialties, and activity
- **CTF Events** - Browse and manage upcoming CTF competitions from CTFTime API
- **Intelligence** - Browse, create, and share CTF writeups
- **Rankings** - Team leaderboard and individual statistics

### 💬 Real-time Chat
- 4 channels: `general`, `ops`, `intel`, `ai-lab`
- Live user presence indicators
- Message history
- Auto-reconnection
- Channel switching

### 🔐 Authentication
- Firebase Authentication
- Role-based access control (Captain, Core, Member)
- Admin panel for user management

### 🎯 Additional Features
- Profile management
- Announcements system
- Command palette (`~` key)
- Responsive design
- Dark theme

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase project (for authentication and database)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**

   The `.env.local` file is already configured with Firebase credentials.
   The Socket.io server URL is set to `http://localhost:3001`.

3. **Start the application (ONE COMMAND!)**
   ```bash
   npm run dev
   ```

   This will automatically start both:
   - **Frontend** (Next.js) on `http://localhost:3000`
   - **Backend** (Socket.io Server) on `http://localhost:3001`

4. **Access the dashboard**

   Open `http://localhost:3000` in your browser

## 📦 Project Structure

```
dedsec-full-final/
├── server/                    # Socket.io backend server
│   ├── server.js             # Main server file
│   ├── package.json          # Server dependencies
│   └── .env                  # Server configuration
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── (dashboard)/      # Dashboard routes
│   │   ├── (marketing)/      # Marketing/landing pages
│   │   └── api/              # API routes
│   ├── components/
│   │   ├── dashboard/        # Dashboard components
│   │   ├── landing/          # Landing page components
│   │   └── ui/               # Reusable UI components
│   ├── lib/
│   │   ├── auth/             # Authentication logic
│   │   ├── db/               # Database functions
│   │   ├── hooks/            # Custom React hooks
│   │   └── utils/            # Utility functions
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
├── .env.local               # Environment variables
├── package.json             # Project dependencies
├── CHAT_SETUP.md            # Chat system documentation
└── README.md                # This file
```

## 🛠 Available Scripts

### Development

```bash
# Start both frontend and backend (RECOMMENDED)
npm run dev

# Start only frontend
npm run client

# Start only backend
npm run server
```

### Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Other

```bash
# Lint code
npm run lint

# Seed test data
npm run seed

# Seed activity data
npm run seed:activity
```

## 🔧 Configuration

### Frontend Configuration (`.env.local`)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Backend Configuration (`server/.env`)
```env
PORT=3001
CLIENT_URL=http://localhost:3000

# Firebase Admin SDK (Required for production deployment)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
```

## 🚀 Deployment

### Deploying to Render

1. **Prepare your Firebase credentials**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Go to **Project Settings** > **Service Accounts**
   - Click **Generate New Private Key**
   - Download the JSON file

2. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Set the following:
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Root Directory**: Leave empty (or set to `server` if deploying only backend)

3. **Configure Environment Variables in Render**

   Add the following environment variables in your Render dashboard:

   **Server Configuration:**
   ```
   PORT=10000
   CLIENT_URL=https://your-frontend-url.com
   ```

   **Firebase Admin SDK** (from the downloaded JSON file):
   ```
   FIREBASE_PROJECT_ID=<project_id from JSON>
   FIREBASE_CLIENT_EMAIL=<client_email from JSON>
   FIREBASE_PRIVATE_KEY=<private_key from JSON, keep the quotes and \n characters>
   ```

   **Important:** When copying the `FIREBASE_PRIVATE_KEY`:
   - Copy the entire value including `"-----BEGIN PRIVATE KEY-----\n...`
   - Keep the `\n` characters in the string (don't replace them with actual newlines)
   - Wrap the value in quotes in Render's environment variable field

4. **Deploy**
   - Click **Create Web Service** or **Deploy**
   - Render will build and deploy your application
   - Your server will be available at the Render URL

5. **Update Frontend Configuration**

   Update your frontend's `NEXT_PUBLIC_SOCKET_URL` to point to your Render backend URL:
   ```env
   NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
   ```

### Deployment Checklist

- [ ] Firebase Admin credentials are set in Render environment variables
- [ ] `CLIENT_URL` is set to your frontend URL
- [ ] Frontend `NEXT_PUBLIC_SOCKET_URL` points to backend URL
- [ ] Firebase Firestore is enabled in Firebase Console
- [ ] CORS settings allow your frontend domain

## 📚 Documentation

- **[Chat Setup Guide](./CHAT_SETUP.md)** - Detailed chat system documentation and troubleshooting

## 🎨 Tech Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Real-time**: Socket.io Client

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Real-time**: Socket.io
- **Cron Jobs**: node-cron
- **HTTP Client**: Axios

### Database & Auth
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage

## 🐛 Troubleshooting

### Chat not connecting
- Ensure both server and client are running (`npm run dev`)
- Check console for errors
- Verify `NEXT_PUBLIC_SOCKET_URL` is set to `http://localhost:3001`

### Build errors
- Delete `node_modules`, `.next`, and `server/node_modules` folders
- Run `npm install` again
- Ensure all environment variables are set

### Firebase errors
- Verify Firebase credentials in `.env.local`
- Check Firebase console for project status
- Ensure Firebase Authentication and Firestore are enabled

## 📝 Notes

- The chat server runs on port **3001** and the frontend on port **3000**
- Both start automatically with `npm run dev`
- Server dependencies are installed automatically on first run

---

**Built with 💀 by DedSec CTF Team**
