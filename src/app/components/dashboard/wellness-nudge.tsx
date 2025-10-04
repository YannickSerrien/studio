
'use client';

import { useState, useEffect } from 'react';
import { Coffee, X } from 'lucide-react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDriverStatus } from '@/app/contexts/driver-status-context';

const BREAK_THRESHOLD_HOURS = 4.5;

export function WellnessNudge() {
  const { showWellnessNudge: shouldShowNudge } = useDriverStatus();
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    if (shouldShowNudge) {
      setShowNudge(true);
    }
  }, [shouldShowNudge]);


  if (!showNudge) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-500">
      <Card className="p-4 bg-card/95 backdrop-blur-sm shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <Coffee className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Time for a break?</CardTitle>
            <CardDescription className="text-sm mt-1">
              You've been driving for {BREAK_THRESHOLD_HOURS}{' '}
              hours. A 45-minute break can help you recharge.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => setShowNudge(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
