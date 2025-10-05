
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Power, Pause, Play } from 'lucide-react';
import { useDriverStatus } from '@/app/contexts/driver-status-context';

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((v) => v.toString().padStart(2, '0'))
    .join(':');
}

export function DriverStatus() {
  const {
    isDriving,
    setIsDriving,
    drivingSeconds,
    setDrivingSeconds,
    isPaused,
    setIsPaused,
    setShowWellnessNudge
  } = useDriverStatus();

  const toggleDriving = () => {
    if (isDriving) {
      // Going offline
      setDrivingSeconds(0);
      setIsPaused(false);
      setIsDriving(false);
      setShowWellnessNudge(false); // Reset the nudge when going offline
    } else {
      // Going online
      setDrivingSeconds(0); // Start timer from 0
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
