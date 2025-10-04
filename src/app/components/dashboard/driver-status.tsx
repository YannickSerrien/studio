'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Power } from 'lucide-react';

type DriverStatusProps = {
  isDriving: boolean;
  setIsDriving: (isDriving: boolean) => void;
  drivingSeconds: number;
  setDrivingSeconds: (seconds: number) => void;
};

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
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isDriving) {
      interval = setInterval(() => {
        setDrivingSeconds(drivingSeconds + 1);
      }, 1000);
    } else if (!isDriving && drivingSeconds !== 0) {
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isDriving, drivingSeconds, setDrivingSeconds]);

  const toggleDriving = () => {
    if (isDriving) {
      setDrivingSeconds(0);
    }
    setIsDriving(!isDriving);
  };

  return (
    <Card className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`h-3 w-3 rounded-full ${
            isDriving ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
        <div>
          <p className="font-medium">{isDriving ? 'Online' : 'Offline'}</p>
          <p className="text-sm text-muted-foreground">
            {isDriving ? 'Actively looking for rides' : 'Not accepting rides'}
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
