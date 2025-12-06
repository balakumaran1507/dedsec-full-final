/**
 * Test Data Seeding Script
 *
 * Run this to populate your Firestore with test data
 * Usage: npx ts-node scripts/seed-test-data.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc, Timestamp } from 'firebase/firestore';

// Your Firebase config (copy from .env or firebase config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedTestData() {
  console.log('🌱 Starting data seeding...\n');

  try {
    // 1. Seed CTF Events
    console.log('📅 Seeding CTF Events...');
    const events = [
      {
        ctftimeId: 2001,
        title: 'DiceCTF 2024',
        description: 'A premier CTF competition by DiceGang',
        url: 'https://ctf.dicega.ng/',
        ctftimeUrl: 'https://ctftime.org/event/2001',
        weight: 85.50,
        format: 'Jeopardy',
        startDate: Timestamp.fromDate(new Date('2024-02-03T00:00:00Z')),
        endDate: Timestamp.fromDate(new Date('2024-02-05T00:00:00Z')),
        duration: 2,
        organizers: [{ id: 1, name: 'DiceGang' }],
        location: 'Online',
        restrictions: 'Open',
        difficulty: 'Hard',
        interestedMembers: [],
        status: 'completed',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        ctftimeId: 2002,
        title: 'Google CTF 2024',
        description: 'Annual CTF by Google',
        url: 'https://capturetheflag.withgoogle.com/',
        ctftimeUrl: 'https://ctftime.org/event/2002',
        weight: 100.00,
        format: 'Jeopardy',
        startDate: Timestamp.fromDate(new Date('2024-06-21T18:00:00Z')),
        endDate: Timestamp.fromDate(new Date('2024-06-23T18:00:00Z')),
        duration: 2,
        organizers: [{ id: 2, name: 'Google' }],
        location: 'Online',
        restrictions: 'Open',
        difficulty: 'Hard',
        interestedMembers: [],
        status: 'upcoming',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        ctftimeId: 2003,
        title: 'PicoCTF 2024',
        description: 'Beginner-friendly CTF by CMU',
        url: 'https://picoctf.org/',
        ctftimeUrl: 'https://ctftime.org/event/2003',
        weight: 45.00,
        format: 'Jeopardy',
        startDate: Timestamp.fromDate(new Date('2024-03-12T00:00:00Z')),
        endDate: Timestamp.fromDate(new Date('2024-03-26T00:00:00Z')),
        duration: 14,
        organizers: [{ id: 3, name: 'CMU' }],
        location: 'Online',
        restrictions: 'Open',
        difficulty: 'Easy',
        interestedMembers: [],
        status: 'upcoming',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
    ];

    for (const event of events) {
      await addDoc(collection(db, 'ctf_events'), event);
    }
    console.log('✅ Added 3 CTF events\n');

    // 2. Seed Writeups
    console.log('📝 Seeding Writeups...');
    const writeups = [
      {
        title: 'SQL Injection in Login Form',
        challengeName: 'Easy Login',
        ctfName: 'DiceCTF 2024',
        category: 'Web',
        difficulty: 'Easy',
        content: `# Challenge Overview
This was a simple SQL injection challenge where the login form was vulnerable to basic SQLi.

## Solution
Used \`' OR '1'='1\` to bypass authentication.

## Flag
\`flag{sql_1nj3ct10n_b4s1cs}\``,
        tags: ['sql-injection', 'web', 'authentication'],
        authorUid: 'YOUR_USER_ID', // Replace with actual user ID
        authorName: 'Test User',
        date: Timestamp.now(),
        upvotes: 15,
        upvotedBy: [],
        hotScore: 150,
      },
      {
        title: 'Buffer Overflow in C Binary',
        challengeName: 'Stack Smasher',
        ctfName: 'Google CTF 2024',
        category: 'Pwn',
        difficulty: 'Hard',
        content: `# Challenge Overview
Classic stack buffer overflow with NX disabled.

## Exploitation
1. Found buffer overflow at offset 72
2. Overwrote return address with shellcode location
3. Got shell and read flag

## Flag
\`flag{pwn_th3_st4ck}\``,
        tags: ['buffer-overflow', 'pwn', 'stack'],
        authorUid: 'YOUR_USER_ID',
        authorName: 'Test User',
        date: Timestamp.now(),
        upvotes: 42,
        upvotedBy: [],
        hotScore: 420,
      },
      {
        title: 'RSA Weak Key Cryptanalysis',
        challengeName: 'Weak Crypto',
        ctfName: 'PicoCTF 2024',
        category: 'Crypto',
        difficulty: 'Medium',
        content: `# Challenge Overview
RSA implementation with small prime factors.

## Solution
Used factordb.com to factor N and recover private key.

## Flag
\`flag{w34k_pr1m3s}\``,
        tags: ['rsa', 'crypto', 'factorization'],
        authorUid: 'YOUR_USER_ID',
        authorName: 'Test User',
        date: Timestamp.now(),
        upvotes: 28,
        upvotedBy: [],
        hotScore: 280,
      },
    ];

    for (const writeup of writeups) {
      await addDoc(collection(db, 'writeups'), writeup);
    }
    console.log('✅ Added 3 writeups\n');

    // 3. Seed Chat Messages
    console.log('💬 Seeding Chat Messages...');
    const messages = [
      {
        channel: 'general',
        senderId: 'system',
        senderName: 'System',
        senderRole: 'admin',
        content: 'Welcome to DedSec CTF Team! 🔥',
        timestamp: Timestamp.now(),
      },
      {
        channel: 'general',
        senderId: 'YOUR_USER_ID',
        senderName: 'Test User',
        senderRole: 'founder',
        content: 'Looking forward to the next CTF!',
        timestamp: Timestamp.now(),
      },
      {
        channel: 'operations',
        senderId: 'YOUR_USER_ID',
        senderName: 'Test User',
        senderRole: 'member',
        content: 'Anyone working on the web challenges?',
        timestamp: Timestamp.now(),
      },
    ];

    for (const message of messages) {
      await addDoc(collection(db, `chat_messages/${message.channel}/messages`), message);
    }
    console.log('✅ Added chat messages\n');

    // 4. Seed Announcements
    console.log('📢 Seeding Announcements...');
    const announcements = [
      {
        title: 'Welcome to DedSec CTF Team!',
        content: 'We are excited to have you on board. Check out the operations page for upcoming CTFs and start contributing writeups!',
        author: 'Admin',
        authorUid: 'YOUR_USER_ID',
        type: 'success',
        pinned: true,
        createdAt: Timestamp.now(),
      },
      {
        title: 'Google CTF Registration Open',
        content: 'Registration for Google CTF 2024 is now open. Make sure to register your interest in the operations page!',
        author: 'Admin',
        authorUid: 'YOUR_USER_ID',
        type: 'info',
        pinned: false,
        createdAt: Timestamp.now(),
      },
      {
        title: 'URGENT: Team Meeting Tomorrow',
        content: 'Mandatory team meeting tomorrow at 8 PM UTC to discuss upcoming CTF strategy. Join the Discord voice channel.',
        author: 'Admin',
        authorUid: 'YOUR_USER_ID',
        type: 'urgent',
        pinned: true,
        createdAt: Timestamp.now(),
      },
    ];

    for (const announcement of announcements) {
      await addDoc(collection(db, 'announcements'), announcement);
    }
    console.log('✅ Added 3 announcements\n');

    console.log('🎉 Data seeding completed successfully!');
    console.log('\n⚠️  IMPORTANT: Replace YOUR_USER_ID with your actual Firebase user ID');
    console.log('   You can find this in Firebase Console > Authentication > Users');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Run the seed function
seedTestData();
