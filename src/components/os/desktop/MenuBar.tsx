"use client";

import { useEffect, useMemo, useState } from "react";

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MenuBar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = useMemo(() => (now ? formatTime(now) : "--:--"), [now]);

  return (
    <div className="pointer-events-auto absolute left-0 right-0 top-0 z-[60] h-[var(--os-menubar-h)]">
      <div className="absolute inset-0 border-b border-white/10 bg-white/[0.04] backdrop-blur-[56px]" />
      <div className="relative mx-auto flex h-full w-full items-center justify-between px-4">
        <div className="flex items-center gap-3 text-[12px] font-medium tracking-tight text-white/85">
          <span className="rounded-md px-2 py-1 hover:bg-white/5">Portfolio</span>
          <span className="text-white/45">File</span>
          <span className="text-white/45">View</span>
          <span className="text-white/45">Window</span>
          <span className="text-white/45">Help</span>
        </div>

        <div className="flex items-center gap-3 text-[12px] text-white/75">
          <a
            href="https://github.com/iotserver24"
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-2 py-1 text-white/75 hover:bg-white/5 hover:text-white/90"
          >
            GitHub
          </a>
          <span className="text-white/55">Wi‑Fi</span>
          <span className="text-white/55">Battery</span>
          <span className="font-medium text-white/85">{time}</span>
        </div>
      </div>
    </div>
  );
}
