/**
 * useWriteups Hook
 *
 * Fetches and manages writeup data
 */

'use client';

import { useState, useEffect } from 'react';
import { WriteupWithAuthor, WriteupFilters, WriteupCategory } from '@/types/writeup';

export function useWriteups(filters?: WriteupFilters) {
  const [writeups, setWriteups] = useState<WriteupWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWriteups = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.authorUid) params.append('authorUid', filters.authorUid);
        if (filters?.ctfName) params.append('ctfName', filters.ctfName);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await fetch(`/api/writeups?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setWriteups(data.writeups);
        } else {
          setError(data.error || 'Failed to fetch writeups');
        }
      } catch (err) {
        console.error('Error fetching writeups:', err);
        setError('Failed to fetch writeups');
      } finally {
        setLoading(false);
      }
    };

    fetchWriteups();
  }, [filters?.category, filters?.authorUid, filters?.ctfName, filters?.sortBy, filters?.limit]);

  return { writeups, loading, error };
}

/**
 * useWriteup Hook
 *
 * Fetches a single writeup by ID
 */
export function useWriteup(id: string) {
  const [writeup, setWriteup] = useState<WriteupWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWriteup = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/writeups/${id}`);
        const data = await response.json();

        if (data.success) {
          setWriteup(data.writeup);
        } else {
          setError(data.error || 'Failed to fetch writeup');
        }
      } catch (err) {
        console.error('Error fetching writeup:', err);
        setError('Failed to fetch writeup');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWriteup();
    }
  }, [id]);

  return { writeup, loading, error };
}

/**
 * useUpvoteWriteup Hook
 *
 * Handles writeup upvoting
 */
export function useUpvoteWriteup() {
  const [upvoting, setUpvoting] = useState(false);

  const upvote = async (writeupId: string, userId: string) => {
    try {
      setUpvoting(true);

      const response = await fetch(`/api/writeups/${writeupId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      return data.success;
    } catch (err) {
      console.error('Error upvoting writeup:', err);
      return false;
    } finally {
      setUpvoting(false);
    }
  };

  const removeUpvote = async (writeupId: string, userId: string) => {
    try {
      setUpvoting(true);

      const response = await fetch(`/api/writeups/${writeupId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'remove' }),
      });

      const data = await response.json();
      return data.success;
    } catch (err) {
      console.error('Error removing upvote:', err);
      return false;
    } finally {
      setUpvoting(false);
    }
  };

  return { upvote, removeUpvote, upvoting };
}
