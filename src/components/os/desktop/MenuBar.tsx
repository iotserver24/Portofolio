"use client";

import { useEffect, useMemo, useState } from "react";

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MenuBar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = useMemo(() => formatTime(now), [now]);

  return (
    <div className="pointer-events-auto absolute left-0 right-0 top-0 z-[60] h-[var(--os-menubar-h)]">
      <div className="mx-auto flex h-full w-full items-center justify-between px-4">
        <div className="flex items-center gap-3 text-[12px] font-medium tracking-tight text-white/85">
          <span className="rounded-md px-2 py-1 hover:bg-white/5">Portfolio</span>
          <span className="text-white/45">File</span>
          <span className="text-white/45">View</span>
          <span className="text-white/45">Window</span>
          <span className="text-white/45">Help</span>
        </div>

        <div className="flex items-center gap-3 text-[12px] text-white/75">
          <span className="text-white/55">Wi‑Fi</span>
          <span className="text-white/55">Battery</span>
          <span className="font-medium text-white/85">{time}</span>
        </div>
      </div>
      <div className="h-px w-full bg-white/10" />
    </div>
  );
}

