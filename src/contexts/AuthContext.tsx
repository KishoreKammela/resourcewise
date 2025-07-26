'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type {
  PlatformUser,
  TeamMember,
  Company,
  PlatformConfiguration,
} from '@/lib/types';
import { getPlatformConfig } from '@/services/platform.services';

type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  user: User | null;
  userProfile: (PlatformUser | TeamMember) | null;
  userRole: 'platform' | 'company' | null;
  companyProfile: Company | null;
  platformConfig: PlatformConfiguration | null;
  loading: boolean;
  sessionStatus: SessionStatus;
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
  const [companyProfile, setCompanyProfile] = useState<Company | null>(null);
  const [platformConfig, setPlatformConfig] =
    useState<PlatformConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('loading');

  const fetchUserProfile = useCallback(async (userToFetch: User | null) => {
    if (!userToFetch) {
      setUserProfile(null);
      setUserRole(null);
      setCompanyProfile(null);
      setPlatformConfig(null);
      setLoading(false);
      return;
    }

    // Fetch platform-wide config first
    const config = await getPlatformConfig('sessionManagement');
    setPlatformConfig(config);

    const platformUserDocRef = doc(db, 'platformUsers', userToFetch.uid);
    const platformUserDoc = await getDoc(platformUserDocRef);

    if (platformUserDoc.exists()) {
      setUserProfile(platformUserDoc.data() as PlatformUser);
      setUserRole('platform');
      setCompanyProfile(null);
    } else {
      const teamMemberDocRef = doc(db, 'teamMembers', userToFetch.uid);
      const teamMemberDoc = await getDoc(teamMemberDocRef);
      if (teamMemberDoc.exists()) {
        const teamMemberData = teamMemberDoc.data() as TeamMember;
        setUserProfile(teamMemberData);
        setUserRole('company');

        // Fetch the associated company profile
        if (teamMemberData.companyId) {
          const companyDocRef = doc(db, 'companies', teamMemberData.companyId);
          const companyDoc = await getDoc(companyDocRef);
          if (companyDoc.exists()) {
            setCompanyProfile({
              id: companyDoc.id,
              ...companyDoc.data(),
            } as Company);
          }
        }
      } else {
        setUserProfile(null);
        setUserRole(null);
        setCompanyProfile(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setUser(user);
      if (user) {
        setSessionStatus('authenticated');
        await fetchUserProfile(user);
      } else {
        setSessionStatus('unauthenticated');
        await fetchUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);

  const logout = useCallback(async () => {
    await signOut(auth);
    // State clearing will be handled by onAuthStateChanged
  }, []);

  const refreshUserProfile = useCallback(async () => {
    if (user) {
      setLoading(true);
      await fetchUserProfile(user);
    }
  }, [user, fetchUserProfile]);

  const value = useMemo(
    () => ({
      user,
      userProfile,
      userRole,
      companyProfile,
      platformConfig,
      loading: sessionStatus === 'loading' || loading,
      sessionStatus,
      logout,
      refreshUserProfile,
    }),
    [
      user,
      userProfile,
      userRole,
      companyProfile,
      platformConfig,
      loading,
      sessionStatus,
      logout,
      refreshUserProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
