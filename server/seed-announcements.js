/**
 * Seed Initial Announcements
 *
 * This script populates the Firestore database with initial announcements
 * for the DedSec CTF Platform.
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
try {
  try {
    const serviceAccountPath = join(__dirname, '../serviceAccount.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch {
    admin.initializeApp({
      projectId: 'dedsec-5eae5'
    });
  }
  console.log('✓ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  process.exit(1);
}

const db = admin.firestore();

// Initial announcements to seed
const announcements = [
  {
    title: 'Welcome to DedSec CTF Platform',
    content: 'Welcome to our CTF platform! This is your hub for collaborative hacking, knowledge sharing, and competitive play. Check out the dashboard for upcoming CTFs, browse writeups from past challenges, and connect with the team in the chat. Let\'s hack the planet!',
    author: 'System',
    authorUid: 'system',
    type: 'info',
    pinned: true,
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    title: 'How to Use the Chat System',
    content: 'The chat system has multiple channels for different purposes:\n\n• #general - General discussion and announcements\n• #ops - Active CTF operations and coordination\n• #intel - Share reconnaissance findings and intel\n• #ai-lab - AI/ML security research and experiments\n\nMessages are automatically saved and synchronized across all devices. Chat history is limited to the most recent 100 messages per channel.',
    author: 'System',
    authorUid: 'system',
    type: 'info',
    pinned: true,
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    title: 'Submit Your First Writeup',
    content: 'Share your knowledge with the team! Navigate to the Writeups section to browse existing writeups or submit your own. Good writeups should include:\n\n• Challenge description and category\n• Step-by-step solution methodology\n• Key insights and learning points\n• Tools and techniques used\n• Code snippets where applicable\n\nQuality writeups help everyone learn and improve their skills.',
    author: 'System',
    authorUid: 'system',
    type: 'success',
    pinned: false,
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    title: 'Check Out Upcoming CTFs',
    content: 'Visit the Events tab to see all upcoming CTF competitions. We automatically sync with CTFTime to keep you updated on the latest events. Mark yourself as interested in events you want to participate in, and coordinate with the team for group participation.',
    author: 'System',
    authorUid: 'system',
    type: 'info',
    pinned: false,
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    title: 'Security Best Practices',
    content: 'Remember to follow security best practices:\n\n• Never share real credentials in chat or writeups\n• Use secure connections when working on challenges\n• Keep your API keys and tokens private\n• Practice responsible disclosure for any vulnerabilities found\n• Respect the rules and scope of each CTF\n\nStay safe and hack responsibly!',
    author: 'System',
    authorUid: 'system',
    type: 'urgent',
    pinned: false,
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    title: 'Platform Updates and Features',
    content: 'Recent platform updates:\n\n✓ Real-time chat with Firebase persistence (100-message rolling window)\n✓ CTFTime integration for automatic event syncing\n✓ Enhanced writeup submission and browsing\n✓ Team statistics and leaderboards\n✓ Discord webhook notifications\n\nMore features coming soon! Have suggestions? Share them in #general.',
    author: 'System',
    authorUid: 'system',
    type: 'success',
    pinned: false,
    createdAt: admin.firestore.Timestamp.now()
  }
];

async function seedAnnouncements() {
  console.log('🌱 Starting announcement seeding...\n');

  try {
    const announcementsRef = db.collection('announcements');

    // Check if announcements already exist
    const existingSnapshot = await announcementsRef.limit(1).get();
    if (!existingSnapshot.empty) {
      console.log('⚠ Announcements already exist. Skipping seed.');
      console.log('💡 To re-seed, delete existing announcements first.\n');

      const shouldContinue = process.argv.includes('--force');
      if (!shouldContinue) {
        console.log('Use --force flag to seed anyway.');
        process.exit(0);
      }
    }

    let count = 0;
    for (const announcement of announcements) {
      const docRef = await announcementsRef.add(announcement);
      console.log(`✓ Created: "${announcement.title}" (ID: ${docRef.id})`);
      count++;
    }

    console.log(`\n✅ Successfully seeded ${count} announcements!`);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding announcements:', error);
    process.exit(1);
  }
}

// Run the seed function
seedAnnouncements();
