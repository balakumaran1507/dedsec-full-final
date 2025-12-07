# Firebase Setup Guide

This guide explains the Firebase persistence features implemented in the DedSec CTF Platform.

## Features Implemented

### 1. Chat Message Persistence (100-Message Rolling Window)

Chat messages are now automatically saved to Firebase Firestore with the following features:

- **Persistent Storage**: Messages survive server restarts
- **100-Message Limit**: Each channel maintains a rolling window of the most recent 100 messages
- **Automatic Cleanup**: When the 101st message is added, the oldest message is automatically deleted
- **Real-time Sync**: Messages are saved asynchronously without blocking the chat

#### How It Works

- Messages are stored in Firestore under `chat_messages/{channel}/messages`
- Channels: `general`, `ops`, `intel`, `ai-lab`
- Each message includes: id, username, content, channel, timestamp
- Old messages are cleaned up automatically when new messages arrive

### 2. Announcements System

The announcements tab has been populated with initial system announcements covering:

- Welcome message
- Chat system guide
- Writeup submission guide
- CTF events information
- Security best practices
- Platform updates

## Firebase Admin Setup (For Server)

The server requires Firebase Admin SDK credentials to persist chat messages. You have two options:

### Option 1: Service Account JSON (Recommended for Production)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `dedsec-5eae5`
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `serviceAccount.json` in the `dedsec-full-final` directory
6. Restart the server

### Option 2: Development Mode (Current Setup)

The server will attempt to initialize with just the project ID. This works in some development environments but may have limitations.

## Creating Initial Announcements

You can create announcements in two ways:

### Method 1: Using the Admin UI (Recommended)

1. Log in as an admin user
2. Navigate to the Announcements tab
3. Click the **+** button
4. Fill in the announcement details
5. Click **CREATE ANNOUNCEMENT**

### Method 2: Using the API Endpoint

If Firebase Admin is properly configured, you can seed announcements via API:

```bash
curl -X POST http://localhost:3001/api/seed/announcements
```

To force re-seed even if announcements exist:

```bash
curl -X POST http://localhost:3001/api/seed/announcements \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

## Firestore Collections Structure

### Chat Messages
```
chat_messages/
  ├── general/
  │   └── messages/
  │       ├── {messageId1}
  │       ├── {messageId2}
  │       └── ...
  ├── ops/
  │   └── messages/
  ├── intel/
  │   └── messages/
  └── ai-lab/
      └── messages/
```

### Announcements
```
announcements/
  ├── {announcementId1}
  ├── {announcementId2}
  └── ...
```

## Environment Variables

Make sure your `.env.local` file contains:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dedsec-5eae5
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Testing the Implementation

### Test Chat Persistence

1. Start the server: `cd server && npm run dev`
2. Start the client: `npm run dev` (from main directory)
3. Open the chat tab and send messages
4. Refresh the page - messages should persist
5. Send 100+ messages and verify old messages are deleted

### Test Announcements

1. Navigate to the Announcements tab
2. Verify that announcements are displayed
3. As an admin, create a new announcement
4. Verify it appears in the list
5. Pin/unpin announcements to test functionality

## Troubleshooting

### Chat Messages Not Persisting

If you see: `⚠ Firebase Admin initialization failed`

- Check that Firebase credentials are properly configured
- Verify Firestore is enabled in your Firebase project
- Check Firestore security rules allow server writes

### Cannot Create Announcements

- Ensure you're logged in as an admin user
- Check browser console for errors
- Verify Firestore security rules allow writes to `announcements` collection

### Server Crashes on Startup

- Check that all environment variables are set
- Verify firebase-admin is installed: `cd server && npm list firebase-admin`
- Review server logs for specific error messages

## Security Rules

Make sure your Firestore has appropriate security rules. Example rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chat messages - authenticated users can read/write
    match /chat_messages/{channel}/messages/{message} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Announcements - authenticated users can read, only admins can write
    match /announcements/{announcement} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

## Next Steps

1. Set up Firebase Admin credentials for production
2. Configure Firestore security rules
3. Monitor Firestore usage and costs
4. Consider implementing message archiving for long-term storage
5. Add moderation features for chat messages
6. Implement announcement editing/deletion for admins

## Support

For issues or questions:
- Check the Firebase Console for errors
- Review server logs
- Consult the Firestore documentation: https://firebase.google.com/docs/firestore
