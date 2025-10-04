
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const BREAK_THRESHOLD_SECONDS = 16200; // 4.5 hours

type DriverStatusContextType = {
  isDriving: boolean;
  setIsDriving: (isDriving: boolean) => void;
  drivingSeconds: number;
  setDrivingSeconds: (seconds: number) => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  showWellnessNudge: boolean;
  setShowWellnessNudge: (show: boolean) => void;
};

const DriverStatusContext = createContext<DriverStatusContextType | undefined>(
  undefined
);

export function DriverStatusProvider({ children }: { children: ReactNode }) {
  const [isDriving, setIsDriving] = useState(false);
  const [drivingSeconds, setDrivingSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showWellnessNudge, setShowWellnessNudge] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isDriving && !isPaused) {
      interval = setInterval(() => {
        setDrivingSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          if (newSeconds === BREAK_THRESHOLD_SECONDS) {
            setShowWellnessNudge(true);
          }
          return newSeconds;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isDriving, isPaused]);

  const value = {
    isDriving,
    setIsDriving,
    drivingSeconds,
    setDrivingSeconds,
    isPaused,
    setIsPaused,
    showWellnessNudge,
    setShowWellnessNudge,
  };

  return (
    <DriverStatusContext.Provider value={value}>
      {children}
    </DriverStatusContext.Provider>
  );
}

export function useDriverStatus() {
  const context = useContext(DriverStatusContext);
  if (context === undefined) {
    throw new Error('useDriverStatus must be used within a DriverStatusProvider');
  }
  return context;
}
