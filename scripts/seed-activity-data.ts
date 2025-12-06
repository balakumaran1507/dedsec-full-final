/**
 * Seed Activity Feed Test Data
 *
 * Run this after seeding main test data to populate activity feed
 * Usage: npx ts-node scripts/seed-activity-data.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, Timestamp } from 'firebase/firestore';
import { createActivity } from '../src/lib/db/activityFeed';

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

async function seedActivityData() {
  console.log('🌱 Starting activity feed seeding...\n');

  try {
    const activities = [
      {
        type: 'member_joined' as const,
        userId: 'YOUR_USER_ID',
        userName: 'Admin',
        userRole: 'founder' as const,
        content: 'Admin joined the team',
      },
      {
        type: 'writeup_created' as const,
        userId: 'YOUR_USER_ID',
        userName: 'Admin',
        userRole: 'founder' as const,
        content: 'Admin wrote a Web writeup: "SQL Injection in Login Form"',
        metadata: {
          writeupId: 'writeup1',
          writeupTitle: 'SQL Injection in Login Form',
          category: 'Web',
        },
      },
      {
        type: 'ctf_joined' as const,
        userId: 'YOUR_USER_ID',
        userName: 'Admin',
        userRole: 'founder' as const,
        content: 'Admin is participating in Google CTF 2024',
        metadata: {
          ctfId: '2002',
          ctfName: 'Google CTF 2024',
        },
      },
      {
        type: 'writeup_created' as const,
        userId: 'YOUR_USER_ID',
        userName: 'Admin',
        userRole: 'founder' as const,
        content: 'Admin wrote a Pwn writeup: "Buffer Overflow in C Binary"',
        metadata: {
          writeupId: 'writeup2',
          writeupTitle: 'Buffer Overflow in C Binary',
          category: 'Pwn',
        },
      },
      {
        type: 'announcement_created' as const,
        userId: 'YOUR_USER_ID',
        userName: 'Admin',
        userRole: 'founder' as const,
        content: 'Admin posted: "Welcome to DedSec CTF Team!"',
      },
      {
        type: 'writeup_created' as const,
        userId: 'YOUR_USER_ID',
        userName: 'Admin',
        userRole: 'founder' as const,
        content: 'Admin wrote a Crypto writeup: "RSA Weak Key Cryptanalysis"',
        metadata: {
          writeupId: 'writeup3',
          writeupTitle: 'RSA Weak Key Cryptanalysis',
          category: 'Crypto',
        },
      },
    ];

    console.log('📝 Creating activity feed items...');

    // Create activities with staggered timestamps (newest first)
    for (let i = 0; i < activities.length; i++) {
      await createActivity(activities[i]);
      console.log(`✅ Created: ${activities[i].content}`);

      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n🎉 Successfully created ${activities.length} activity items!`);
    console.log('\n⚠️  IMPORTANT: Replace YOUR_USER_ID with your actual Firebase user ID');
    console.log('   You can find this in Firebase Console > Authentication > Users\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding activity data:', error);
    process.exit(1);
  }
}

// Run the seed function
seedActivityData();
