/**
 * useAuth Hook
 *
 * Provides authentication state and methods using Firebase Auth.
 * Automatically syncs with Firestore user document.
 */

'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { auth } from '../firebase/init';
import { User } from '@/types/user';
import { getUser, createUser } from '../db/user';

/**
 * Auth context value
 */
interface AuthContextValue {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  sendEmailLink: (email: string) => Promise<void>;
  completeEmailLinkSignIn: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch user document from Firestore
   */
  const fetchUserDocument = async (uid: string): Promise<User | null> => {
    try {
      const userDoc = await getUser(uid);
      return userDoc;
    } catch (error) {
      console.error('Error fetching user document:', error);
      return null;
    }
  };

  /**
   * Refresh user data from Firestore
   */
  const refreshUser = async () => {
    if (!firebaseUser) return;

    const userDoc = await fetchUserDocument(firebaseUser.uid);
    if (userDoc) {
      setUser(userDoc);
    }
  };

  /**
   * Listen to auth state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user document from Firestore
        const userDoc = await fetchUserDocument(firebaseUser.uid);

        if (userDoc) {
          setUser(userDoc);
        } else {
          // User document doesn't exist (shouldn't happen in normal flow)
          console.warn('User authenticated but no Firestore document found');
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the rest
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  /**
   * Sign up with email and password
   *
   * NOTE: In production, sign up should be invite-only.
   * This method should only be called after validating an invite token.
   */
  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name
      await updateProfile(userCredential.user, { displayName });

      // Create Firestore user document
      await createUser({
        uid: userCredential.user.uid,
        email,
        displayName,
        role: 'member',
        discordId: null,
      });

      // onAuthStateChanged will fetch the new user document
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  /**
   * Sign in with Google OAuth
   */
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if user document exists, create if not
      const existingUser = await getUser(result.user.uid);
      if (!existingUser) {
        await createUser({
          uid: result.user.uid,
          email: result.user.email!,
          displayName: result.user.displayName || 'Anonymous',
          role: 'member',
          discordId: null,
        });
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  /**
   * Sign in with GitHub OAuth
   */
  const signInWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if user document exists, create if not
      const existingUser = await getUser(result.user.uid);
      if (!existingUser) {
        await createUser({
          uid: result.user.uid,
          email: result.user.email!,
          displayName: result.user.displayName || 'Anonymous',
          role: 'member',
          discordId: null,
        });
      }
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      throw error;
    }
  };

  /**
   * Send email link for passwordless authentication
   */
  const sendEmailLink = async (email: string) => {
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/auth/complete`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      // Save email to localStorage for completion
      window.localStorage.setItem('emailForSignIn', email);
    } catch (error) {
      console.error('Error sending email link:', error);
      throw error;
    }
  };

  /**
   * Complete email link sign-in
   */
  const completeEmailLinkSignIn = async (email: string) => {
    try {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        throw new Error('Invalid sign-in link');
      }

      const result = await signInWithEmailLink(auth, email, window.location.href);

      // Clear email from localStorage
      window.localStorage.removeItem('emailForSignIn');

      // Check if user document exists, create if not
      const existingUser = await getUser(result.user.uid);
      if (!existingUser) {
        await createUser({
          uid: result.user.uid,
          email: result.user.email!,
          displayName: result.user.displayName || 'Anonymous',
          role: 'member',
          discordId: null,
        });
      }
    } catch (error) {
      console.error('Error completing email link sign-in:', error);
      throw error;
    }
  };

  const value: AuthContextValue = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshUser,
    signInWithGoogle,
    signInWithGithub,
    sendEmailLink,
    completeEmailLinkSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 *
 * Access authentication state and methods
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * Check if user is admin or founder
 */
export function useIsAdmin(): boolean {
  const { user } = useAuth();
  return user?.role === 'admin' || user?.role === 'founder';
}

/**
 * Require authentication (for protected pages)
 */
export function useRequireAuth() {
  const { user, loading } = useAuth();

  if (!loading && !user) {
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return { user, loading };
}
