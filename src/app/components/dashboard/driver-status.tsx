'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Power, Pause, Play } from 'lucide-react';

type DriverStatusProps = {
  isDriving: boolean;
  setIsDriving: (isDriving: boolean) => void;
  drivingSeconds: number;
  setDrivingSeconds: (seconds: number) => void;
};

const TIMER_START_SECONDS = 16190; // 4.5 hours - 10 seconds

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((v) => v.toString().padStart(2, '0'))
    .join(':');
}

export function DriverStatus({
  isDriving,
  setIsDriving,
  drivingSeconds,
  setDrivingSeconds,
}: DriverStatusProps) {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isDriving && !isPaused) {
      interval = setInterval(() => {
        setDrivingSeconds(drivingSeconds + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isDriving, isPaused, drivingSeconds, setDrivingSeconds]);

  const toggleDriving = () => {
    if (isDriving) {
      // Going offline
      setDrivingSeconds(0);
      setIsPaused(false);
      setIsDriving(false);
    } else {
      // Going online
      setDrivingSeconds(TIMER_START_SECONDS);
      setIsDriving(true);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <Card className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`h-3 w-3 rounded-full ${
            isDriving && !isPaused ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
        <div>
          <p className="font-medium">
            {isDriving ? (isPaused ? 'Paused' : 'Online') : 'Offline'}
          </p>
          <p className="text-sm text-muted-foreground">
            {isDriving
              ? isPaused
                ? 'On a break'
                : 'Actively looking for rides'
              : 'Not accepting rides'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isDriving && (
          <div className="text-right">
            <p className="text-lg font-mono font-bold">
              {formatDuration(drivingSeconds)}
            </p>
            <p className="text-xs text-muted-foreground">Session Time</p>
          </div>
        )}
        {isDriving && (
          <Button
            onClick={togglePause}
            variant="outline"
            size="icon"
            aria-label={isPaused ? 'Resume Driving' : 'Pause Driving'}
          >
            {isPaused ? <Play /> : <Pause />}
          </Button>
        )}
        <Button
          onClick={toggleDriving}
          variant={isDriving ? 'destructive' : 'default'}
          className="w-[140px]"
        >
          <Power className="mr-2 h-4 w-4" />
          {isDriving ? 'Go Offline' : 'Go Online'}
        </Button>
      </div>
    </Card>
  );
}
