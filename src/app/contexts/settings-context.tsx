
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Settings as AppSettings } from '@/app/lib/data';

type SettingsContextType = {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>({
    name: 'Karen',
    currency: '€',
    country: 'Netherlands',
    city: '3',
  });

  const value = {
    settings,
    setSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
