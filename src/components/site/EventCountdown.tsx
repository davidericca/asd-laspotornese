"use client";

import { useEffect, useState } from "react";

type Remaining = { days: number; hours: number; minutes: number };

function getRemaining(target: Date): Remaining {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
  };
}

export function EventCountdown({
  eventDate,
  eventTime,
}: {
  eventDate: string;
  eventTime: string | null;
}) {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const target = new Date(`${eventDate}T${eventTime ?? "00:00"}`);
    const tick = () => setRemaining(getRemaining(target));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [eventDate, eventTime]);

  if (!remaining || (remaining.days === 0 && remaining.hours === 0 && remaining.minutes === 0)) {
    return null;
  }

  return (
    <div className="ml-auto flex gap-4">
      <div className="text-center">
        <div className="font-mono text-xl font-bold text-primary-foreground">{remaining.days}</div>
        <div className="font-mono text-[9px] tracking-widest text-primary-foreground/50 uppercase">
          Giorni
        </div>
      </div>
      <div className="text-center">
        <div className="font-mono text-xl font-bold text-primary-foreground">{remaining.hours}</div>
        <div className="font-mono text-[9px] tracking-widest text-primary-foreground/50 uppercase">
          Ore
        </div>
      </div>
      <div className="text-center">
        <div className="font-mono text-xl font-bold text-primary-foreground">{remaining.minutes}</div>
        <div className="font-mono text-[9px] tracking-widest text-primary-foreground/50 uppercase">
          Min
        </div>
      </div>
    </div>
  );
}
