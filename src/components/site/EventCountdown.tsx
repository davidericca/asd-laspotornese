"use client";

import { useEffect, useState } from "react";

type Remaining = { days: number; hours: number };

function getRemaining(target: Date): Remaining {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
  };
}

function Segment({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-mono text-xl font-bold text-primary-foreground">
        {String(value).padStart(2, "0")}
      </div>
      <div className="font-mono text-[9px] tracking-widest text-primary-foreground/50 uppercase">
        {label}
      </div>
    </div>
  );
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

  if (!remaining || (remaining.days === 0 && remaining.hours === 0)) {
    return null;
  }

  return (
    <div className="ml-auto flex gap-4">
      <Segment value={remaining.days} label="Giorni" />
      <Segment value={remaining.hours} label="Ore" />
    </div>
  );
}
