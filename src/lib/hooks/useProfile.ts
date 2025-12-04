/**
 * useProfile Hook
 *
 * Fetches and manages user profile data
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import { User, PublicUserProfile } from '@/types/user';
import { getUser, getPublicUserProfile, updateUserProfile } from '../db/user';
import { getWriteupsByAuthor } from '../db/writeups';
import { Writeup } from '@/types/writeup';

export function useProfile(userId?: string) {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<User | PublicUserProfile | null>(null);
  const [recentWriteups, setRecentWriteups] = useState<Writeup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || currentUser?.uid;

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch full profile if viewing own profile, otherwise public profile
        const isOwnProfile = targetUserId === currentUser?.uid;
        const profileData = isOwnProfile
          ? await getUser(targetUserId)
          : await getPublicUserProfile(targetUserId);

        setProfile(profileData);

        // Fetch recent writeups
        const writeups = await getWriteupsByAuthor(targetUserId, 5);
        setRecentWriteups(writeups);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserId, currentUser]);

  return { profile, recentWriteups, loading, error };
}

/**
 * useUpdateProfile Hook
 *
 * Provides method to update user profile
 */
export function useUpdateProfile() {
  const { refreshUser } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (uid: string, updates: any) => {
    try {
      setUpdating(true);
      setError(null);
      await updateUserProfile(uid, updates);
      await refreshUser(); // Refresh auth context
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  return { updateProfile, updating, error };
}
