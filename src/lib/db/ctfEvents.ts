/**
 * CTF Events Database Service
 *
 * Handles all CTF event-related Firestore operations including:
 * - CTF event CRUD operations
 * - CTFTime API integration
 * - Event status management
 * - User interest tracking
 * - Event filtering and querying
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../firebase/init';
import {
  CTFEvent,
  CTFEventCreationData,
  CTFEventFilters,
  CTFEventStatus,
  CTFTimeEvent,
  CTFFormat,
} from '@/types/ctf';
import { getDifficultyFromWeight, calculateEventDuration } from '../utils/scoring';
import { incrementUserStats } from './user';

// Collection name
const CTF_EVENTS_COLLECTION = 'ctf_events';

/**
 * Firestore timeout wrapper (5 seconds)
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 5000): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Firestore operation timed out')), timeoutMs)
  );
  return Promise.race([promise, timeoutPromise]);
}

/**
 * Parse CTFTime event to internal format
 */
export function parseCTFTimeEvent(ctfTimeEvent: CTFTimeEvent): CTFEventCreationData {
  const startDate = Timestamp.fromDate(new Date(ctfTimeEvent.start));
  const endDate = Timestamp.fromDate(new Date(ctfTimeEvent.finish));

  const duration = calculateEventDuration(startDate, endDate);
  const difficulty = getDifficultyFromWeight(ctfTimeEvent.weight);

  return {
    ctftimeId: ctfTimeEvent.id,
    title: ctfTimeEvent.title,
    description: ctfTimeEvent.description || '',
    url: ctfTimeEvent.url,
    ctftimeUrl: ctfTimeEvent.ctftime_url,
    logo: ctfTimeEvent.logo,
    weight: ctfTimeEvent.weight,
    format: (ctfTimeEvent.format as CTFFormat) || 'Other',
    startDate,
    endDate,
    duration,
    organizers: ctfTimeEvent.organizers || [],
    location: ctfTimeEvent.location || 'Online',
    restrictions: ctfTimeEvent.restrictions || 'Open',
    difficulty,
    status: determineEventStatus(startDate, endDate),
  };
}

/**
 * Determine event status based on dates
 */
function determineEventStatus(
  startDate: Date | Timestamp,
  endDate: Date | Timestamp
): CTFEventStatus {
  const now = new Date();
  const start = startDate instanceof Date ? startDate : startDate.toDate();
  const end = endDate instanceof Date ? endDate : endDate.toDate();

  if (now < start) {
    return 'upcoming';
  } else if (now >= start && now <= end) {
    return 'ongoing';
  } else {
    return 'completed';
  }
}

/**
 * Create or update CTF event
 */
export async function createOrUpdateCTFEvent(
  data: CTFEventCreationData
): Promise<CTFEvent> {
  try {
    // Check if event with same ctftimeId already exists
    const existingEvent = await getCTFEventByCTFTimeId(data.ctftimeId);

    const now = Timestamp.now();

    if (existingEvent) {
      // Update existing event
      const eventRef = doc(db, CTF_EVENTS_COLLECTION, existingEvent.id);

      const updatedEvent: CTFEvent = {
        ...existingEvent,
        ...data,
        updatedAt: now,
      };

      await withTimeout(setDoc(eventRef, updatedEvent));
      return updatedEvent;
    } else {
      // Create new event
      const eventRef = doc(collection(db, CTF_EVENTS_COLLECTION));

      const event: CTFEvent = {
        id: eventRef.id,
        ...data,
        interestedMembers: [],
        createdAt: now,
        updatedAt: now,
      };

      await withTimeout(setDoc(eventRef, event));
      return event;
    }
  } catch (error) {
    console.error('Error creating/updating CTF event:', error);
    throw new Error('Failed to create/update CTF event');
  }
}

/**
 * Get CTF event by ID
 */
export async function getCTFEvent(id: string): Promise<CTFEvent | null> {
  try {
    const eventRef = doc(db, CTF_EVENTS_COLLECTION, id);
    const eventSnap = await withTimeout(getDoc(eventRef));

    if (!eventSnap.exists()) {
      return null;
    }

    return eventSnap.data() as CTFEvent;
  } catch (error) {
    console.error('Error getting CTF event:', error);
    return null;
  }
}

/**
 * Get CTF event by CTFTime ID
 */
export async function getCTFEventByCTFTimeId(
  ctftimeId: number
): Promise<CTFEvent | null> {
  try {
    const eventsRef = collection(db, CTF_EVENTS_COLLECTION);
    const q = query(eventsRef, where('ctftimeId', '==', ctftimeId), limit(1));
    const querySnapshot = await withTimeout(getDocs(q));

    if (querySnapshot.empty) {
      return null;
    }

    return querySnapshot.docs[0].data() as CTFEvent;
  } catch (error) {
    console.error('Error getting CTF event by CTFTime ID:', error);
    return null;
  }
}

/**
 * Get CTF events with filters
 */
export async function getCTFEvents(
  filters: CTFEventFilters = {}
): Promise<CTFEvent[]> {
  try {
    const eventsRef = collection(db, CTF_EVENTS_COLLECTION);
    let q = query(eventsRef);

    // Apply filters
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters.difficulty) {
      q = query(q, where('difficulty', '==', filters.difficulty));
    }

    if (filters.format) {
      q = query(q, where('format', '==', filters.format));
    }

    // Sort by start date (ascending for upcoming, descending for completed)
    q = query(q, orderBy('startDate', 'asc'));

    // Apply limit
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const querySnapshot = await withTimeout(getDocs(q));
    return querySnapshot.docs.map((doc) => doc.data() as CTFEvent);
  } catch (error) {
    console.error('Error getting CTF events:', error);
    return [];
  }
}

/**
 * Get upcoming CTF events
 */
export async function getUpcomingCTFEvents(limitCount = 50): Promise<CTFEvent[]> {
  return getCTFEvents({ status: 'upcoming', limit: limitCount });
}

/**
 * Get ongoing CTF events
 */
export async function getOngoingCTFEvents(): Promise<CTFEvent[]> {
  return getCTFEvents({ status: 'ongoing' });
}

/**
 * Get completed CTF events
 */
export async function getCompletedCTFEvents(limitCount = 20): Promise<CTFEvent[]> {
  return getCTFEvents({ status: 'completed', limit: limitCount });
}

/**
 * Toggle user interest in a CTF event
 */
export async function toggleUserInterest(
  eventId: string,
  userId: string
): Promise<boolean> {
  try {
    const event = await getCTFEvent(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const isInterested = event.interestedMembers.includes(userId);
    const eventRef = doc(db, CTF_EVENTS_COLLECTION, eventId);

    if (isInterested) {
      // Remove interest
      await withTimeout(
        updateDoc(eventRef, {
          interestedMembers: arrayRemove(userId),
        })
      );

      // Decrement user's CTF participation stat
      await incrementUserStats(userId, { ctfParticipation: -1 });

      return false;
    } else {
      // Add interest
      await withTimeout(
        updateDoc(eventRef, {
          interestedMembers: arrayUnion(userId),
        })
      );

      // Increment user's CTF participation stat
      await incrementUserStats(userId, { ctfParticipation: 1 });

      return true;
    }
  } catch (error) {
    console.error('Error toggling user interest:', error);
    throw new Error('Failed to toggle interest');
  }
}

/**
 * Check if user is interested in an event
 */
export async function isUserInterested(
  eventId: string,
  userId: string
): Promise<boolean> {
  const event = await getCTFEvent(eventId);
  return event?.interestedMembers.includes(userId) ?? false;
}

/**
 * Update event statuses (called by cron job)
 */
export async function updateEventStatuses(): Promise<void> {
  try {
    const allEvents = await getCTFEvents();

    for (const event of allEvents) {
      const newStatus = determineEventStatus(event.startDate, event.endDate);

      if (newStatus !== event.status) {
        const eventRef = doc(db, CTF_EVENTS_COLLECTION, event.id);
        await withTimeout(
          updateDoc(eventRef, {
            status: newStatus,
            updatedAt: Timestamp.now(),
          })
        );
      }
    }
  } catch (error) {
    console.error('Error updating event statuses:', error);
    // Don't throw - this is a background operation
  }
}

/**
 * Get events starting within N hours (for notifications)
 */
export async function getEventsStartingSoon(hours = 24): Promise<CTFEvent[]> {
  try {
    const now = new Date();
    const futureDate = new Date(now.getTime() + hours * 60 * 60 * 1000);

    const upcomingEvents = await getUpcomingCTFEvents();

    return upcomingEvents.filter((event) => {
      const start =
        event.startDate instanceof Date
          ? event.startDate
          : event.startDate.toDate();

      return start >= now && start <= futureDate;
    });
  } catch (error) {
    console.error('Error getting events starting soon:', error);
    return [];
  }
}

/**
 * Get total CTF event count
 */
export async function getTotalCTFEventCount(): Promise<number> {
  try {
    const eventsRef = collection(db, CTF_EVENTS_COLLECTION);
    const querySnapshot = await withTimeout(getDocs(eventsRef));
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting CTF event count:', error);
    return 0;
  }
}

/**
 * Sync events from CTFTime API
 *
 * TODO: Implement actual CTFTime API fetch
 * For now, this is a stub that would be called from an API route
 */
export async function syncCTFTimeEvents(
  ctfTimeEvents: CTFTimeEvent[]
): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  try {
    for (const ctfTimeEvent of ctfTimeEvents) {
      const eventData = parseCTFTimeEvent(ctfTimeEvent);
      const existingEvent = await getCTFEventByCTFTimeId(eventData.ctftimeId);

      if (existingEvent) {
        updated++;
      } else {
        created++;
      }

      await createOrUpdateCTFEvent(eventData);
    }

    // Update event statuses after sync
    await updateEventStatuses();

    return { created, updated };
  } catch (error) {
    console.error('Error syncing CTFTime events:', error);
    throw new Error('Failed to sync CTFTime events');
  }
}
