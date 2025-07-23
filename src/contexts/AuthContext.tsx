'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<(PlatformUser | TeamMember) | null>(null);
  const [userRole, setUserRole] = useState<'platform' | 'company' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const platformUserDocRef = doc(db, 'platformUsers', user.uid);
        const platformUserDoc = await getDoc(platformUserDocRef);

        if (platformUserDoc.exists()) {
          setUserProfile(platformUserDoc.data() as PlatformUser);
          setUserRole('platform');
        } else {
          const teamMemberDocRef = doc(db, 'teamMembers', user.uid);
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
      } else {
        setUser(null);
        setUserProfile(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    setUserRole(null);
  };

  const value = { user, userProfile, userRole, loading, logout };

  return (
    <AuthContext.Provider value={value}>
       {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
