/**
 * CTFTime API Integration
 *
 * Fetches upcoming CTF events from CTFTime.org API
 * and syncs them to Firestore
 */

import { syncCTFTimeEvents } from '../db/ctfEvents';
import { CTFTimeEvent } from '@/types/ctf';

const CTFTIME_API_BASE = 'https://ctftime.org/api/v1';

/**
 * Fetch upcoming CTF events from CTFTime
 */
export async function fetchUpcomingCTFs(limit = 100): Promise<CTFTimeEvent[]> {
  try {
    // Get current timestamp and 90 days from now
    const now = Math.floor(Date.now() / 1000);
    const futureDate = now + (90 * 24 * 60 * 60); // 90 days

    const response = await fetch(
      `${CTFTIME_API_BASE}/events/?limit=${limit}&start=${now}&finish=${futureDate}`,
      {
        headers: {
          'User-Agent': 'DedSec-CTF-Dashboard/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CTFTime API error: ${response.status}`);
    }

    const data = await response.json();
    return data as CTFTimeEvent[];
  } catch (error) {
    console.error('Error fetching CTFTime events:', error);
    return [];
  }
}

/**
 * Fetch and sync upcoming CTFs to Firestore
 */
export async function syncUpcomingCTFs(limit = 50): Promise<{
  success: boolean;
  created: number;
  updated: number;
  error?: string;
}> {
  try {
    console.log('🔄 Fetching upcoming CTFs from CTFTime...');
    const ctfTimeEvents = await fetchUpcomingCTFs(limit);

    if (ctfTimeEvents.length === 0) {
      return {
        success: false,
        created: 0,
        updated: 0,
        error: 'No events fetched from CTFTime',
      };
    }

    console.log(`📥 Fetched ${ctfTimeEvents.length} events from CTFTime`);
    console.log('💾 Syncing to Firestore...');

    const result = await syncCTFTimeEvents(ctfTimeEvents);

    console.log(`✅ Sync complete: ${result.created} created, ${result.updated} updated`);

    return {
      success: true,
      created: result.created,
      updated: result.updated,
    };
  } catch (error) {
    console.error('Error syncing CTFTime events:', error);
    return {
      success: false,
      created: 0,
      updated: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch specific CTF event details by ID
 */
export async function fetchCTFById(ctfId: number): Promise<CTFTimeEvent | null> {
  try {
    const response = await fetch(`${CTFTIME_API_BASE}/events/${ctfId}/`, {
      headers: {
        'User-Agent': 'DedSec-CTF-Dashboard/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`CTFTime API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching CTF ${ctfId}:`, error);
    return null;
  }
}

/**
 * Fetch CTFTime team information (for leaderboard integration)
 */
export async function fetchTeamInfo(teamId: number): Promise<any> {
  try {
    const response = await fetch(`${CTFTIME_API_BASE}/teams/${teamId}/`, {
      headers: {
        'User-Agent': 'DedSec-CTF-Dashboard/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`CTFTime API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching team ${teamId}:`, error);
    return null;
  }
}
