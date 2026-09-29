'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations } from '@/lib/translations';

export interface UserProfile {
  age?: number;
  dob?: string;
  gender?: string;
  preferredLanguage?: 'bn' | 'en';
  medicalConditions?: string[];
  medicineAllergies?: string[];
  currentMedicines?: string[];
  pregnancyStatus?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relation?: string;
  };
}

export interface UserSettings {
  saveChatHistory: boolean;
  rememberHealthInfo: boolean;
  privacyConsentGiven: boolean;
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  profile?: UserProfile;
  settings: UserSettings;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['bn'];
  user: AppUser | null;
  isLoadingUser: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  isConsentModalOpen: boolean;
  setIsConsentModalOpen: (open: boolean) => void;
  isGuest: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('bn');
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

  const fetchSession = async () => {
    try {
      setIsLoadingUser(true);
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
        if (data.user.profile?.preferredLanguage) {
          setLanguageState(data.user.profile.preferredLanguage);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    // Check saved language preference in localStorage
    const savedLang = localStorage.getItem('od_lang') as Language;
    if (savedLang === 'bn' || savedLang === 'en') {
      setLanguageState(savedLang);
    }
    fetchSession();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('od_lang', lang);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const t = translations[language];
  const isGuest = !user;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        user,
        isLoadingUser,
        refreshUser: fetchSession,
        logout,
        isConsentModalOpen,
        setIsConsentModalOpen,
        isGuest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
