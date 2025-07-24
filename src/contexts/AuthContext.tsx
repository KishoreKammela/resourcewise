'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useCallback,
} from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { PlatformUser, TeamMember } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  userProfile: (PlatformUser | TeamMember) | null;
  userRole: 'platform' | 'company' | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<
    (PlatformUser | TeamMember) | null
  >(null);
  const [userRole, setUserRole] = useState<'platform' | 'company' | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userToFetch: User | null) => {
    if (!userToFetch) {
      setUser(null);
      setUserProfile(null);
      setUserRole(null);
      setLoading(false);
      return;
    }

    setUser(userToFetch);
    const platformUserDocRef = doc(db, 'platformUsers', userToFetch.uid);
    const platformUserDoc = await getDoc(platformUserDocRef);

    if (platformUserDoc.exists()) {
      setUserProfile(platformUserDoc.data() as PlatformUser);
      setUserRole('platform');
    } else {
      const teamMemberDocRef = doc(db, 'teamMembers', userToFetch.uid);
      const teamMemberDoc = await getDoc(teamMemberDocRef);
      if (teamMemberDoc.exists()) {
        setUserProfile(teamMemberDoc.data() as TeamMember);
        setUserRole('company');
      } else {
        console.warn('User authenticated but no profile document found.');
        setUserProfile(null);
        setUserRole(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      await fetchUserProfile(user);
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    setUserRole(null);
  };

  const refreshUserProfile = useCallback(async () => {
    setLoading(true);
    await fetchUserProfile(user);
  }, [user, fetchUserProfile]);

  const value = {
    user,
    userProfile,
    userRole,
    loading,
    logout,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
