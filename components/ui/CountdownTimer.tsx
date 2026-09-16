'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialSeconds?: number;
  onExpire?: () => void;
  compact?: boolean;
}

export function CountdownTimer({ initialSeconds = 2570, onExpire, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const totalSeconds = 3600; // 60 min reference window

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatPad = (num: number) => String(num).padStart(2, '0');

  // SVG Circular Ring calculation
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  // Progress fraction (between 0 and 1)
  const progress = Math.min(Math.max(timeLeft / totalSeconds, 0.15), 0.85);
  const strokeDashoffset = circumference * (1 - progress);

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-brand/10 border border-brand/20 px-3 py-1.5 text-xs font-mono font-bold text-brand">
        <span>{formatPad(minutes)}:{formatPad(seconds)}</span>
        <span className="text-[10px] text-muted-foreground font-sans uppercase">Auto-Release</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Circular SVG Ring */}
      <div className="relative flex size-44 sm:size-48 items-center justify-center">
        <svg className="size-full -rotate-90" viewBox="0 0 160 160">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            className="text-muted/40 dark:text-muted/20"
          />
          {/* Active Green Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="var(--brand)"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {formatPad(minutes)}:{formatPad(seconds)}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-muted-foreground uppercase mt-1">
            AUTO-RELEASE
          </span>
        </div>
      </div>

      {/* Info text below */}
      <p className="mt-4 text-center text-xs text-muted-foreground max-w-xs leading-relaxed">
        Funds release to the seller automatically if you don&apos;t raise a dispute before the timer ends.
      </p>
    </div>
  );
}
