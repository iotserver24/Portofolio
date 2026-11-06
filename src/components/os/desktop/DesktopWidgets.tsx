"use client";

import { useEffect, useState } from "react";
import { useDesktopOS } from "@/components/os/state/DesktopOSContext";

export function DesktopWidgets() {
  const { widgets } = useDesktopOS();

  if (!widgets || widgets.length === 0) return null;

  return (
    <div className="pointer-events-none absolute bottom-16 right-4 top-16 z-0 flex w-72 flex-col gap-4 overflow-y-auto pb-4 select-none md:right-6">
      {widgets.includes("clock") && <ClockWidget />}
      {widgets.includes("sys-monitor") && <SysMonitorWidget />}
      {widgets.includes("notes") && <StickyNotesWidget />}
    </div>
  );
}

function ClockWidget() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  const hr = time.getHours();
  const min = time.getMinutes();
  const sec = time.getSeconds();

  // Rotation angles for analog clock hands
  const hrAngle = (hr % 12) * 30 + min * 0.5;
  const minAngle = min * 6;
  const secAngle = sec * 6;

  const dateStr = time.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const timeStr = time.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="pointer-events-auto flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md">
      {/* Analog Clock SVG */}
      <svg className="h-28 w-28 text-white/90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-20" />
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-40" strokeDasharray="2 4" />
        
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 50 + 40 * Math.sin(angle);
          const y1 = 50 - 40 * Math.cos(angle);
          const x2 = 50 + 44 * Math.sin(angle);
          const y2 = 50 - 44 * Math.cos(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={i % 3 === 0 ? "2" : "1"}
              className={i % 3 === 0 ? "opacity-75" : "opacity-40"}
            />
          );
        })}

        {/* Hour Hand */}
        <line
          x1="50"
          y1="50"
          x2={50 + 25 * Math.sin((hrAngle * Math.PI) / 180)}
          y2={50 - 25 * Math.cos((hrAngle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="opacity-90"
        />

        {/* Minute Hand */}
        <line
          x1="50"
          y1="50"
          x2={50 + 35 * Math.sin((minAngle * Math.PI) / 180)}
          y2={50 - 35 * Math.cos((minAngle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-75"
        />

        {/* Second Hand */}
        <line
          x1="50"
          y1="50"
          x2={50 + 38 * Math.sin((secAngle * Math.PI) / 180)}
          y2={50 - 38 * Math.cos((secAngle * Math.PI) / 180)}
          stroke="#f43f5e"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Center pin */}
        <circle cx="50" cy="50" r="2.5" fill="#f43f5e" />
        <circle cx="50" cy="50" r="1" fill="white" />
      </svg>

      {/* Digital clock display */}
      <div className="text-center font-mono">
        <div className="text-[17px] font-semibold tracking-wider text-white/90">{timeStr}</div>
        <div className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase mt-0.5">{dateStr}</div>
      </div>
    </div>
  );
}

function SysMonitorWidget() {
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(20).fill(12));
  const [ramHistory, setRamHistory] = useState<number[]>(Array(20).fill(50));
  const [cpu, setCpu] = useState(12);
  const [ram, setRam] = useState(50);

  useEffect(() => {
    const id = setInterval(() => {
      // Simulate fluctuation
      setCpu((prev) => {
        const delta = (Math.random() - 0.5) * 8;
        const next = Math.max(5, Math.min(95, Math.round(prev + delta)));
        setCpuHistory((h) => [...h.slice(1), next]);
        return next;
      });

      setRam((prev) => {
        const delta = (Math.random() - 0.5) * 2;
        const next = Math.max(45, Math.min(55, Math.round(prev + delta)));
        setRamHistory((h) => [...h.slice(1), next]);
        return next;
      });
    }, 1500);

    return () => clearInterval(id);
  }, []);

  const makeSvgPath = (history: number[]) => {
    const w = 240;
    const h = 40;
    const len = history.length;
    const step = w / (len - 1);
    
    return history
      .map((val, index) => {
        const x = index * step;
        // Invert y because SVG y goes downwards
        const y = h - (val / 100) * h;
        return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  };

  return (
    <div className="pointer-events-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md space-y-3">
      <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
        <span>Activity Monitor</span>
        <span className="text-[9px] text-emerald-400 font-mono animate-pulse">● Live</span>
      </div>

      {/* CPU Monitor */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-mono">
          <span className="text-zinc-400">CPU Usage</span>
          <span className="text-emerald-400 font-semibold">{cpu}%</span>
        </div>
        <div className="relative h-10 w-full rounded bg-zinc-950/40 overflow-hidden border border-zinc-800/40">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 240 40">
            {/* Grid line */}
            <line x1="0" y1="20" x2="240" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <path
              d={makeSvgPath(cpuHistory)}
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* RAM Monitor */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-mono">
          <span className="text-zinc-400">Memory Usage</span>
          <span className="text-sky-400 font-semibold">{ram}%</span>
        </div>
        <div className="relative h-10 w-full rounded bg-zinc-950/40 overflow-hidden border border-zinc-800/40">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 240 40">
            <line x1="0" y1="20" x2="240" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <path
              d={makeSvgPath(ramHistory)}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function StickyNotesWidget() {
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("os_sticky_note");
    if (saved) setNote(saved);
  }, []);

  const handleChange = (val: string) => {
    setNote(val);
    localStorage.setItem("os_sticky_note", val);
  };

  return (
    <div className="pointer-events-auto rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.04] p-3 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md space-y-2 border-l-4 border-l-yellow-500/60">
      <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-yellow-400/80 uppercase">
        <span>📌 Sticky Note</span>
        <span className="text-[8px] text-zinc-500 font-mono">Autosaved</span>
      </div>

      <textarea
        className="w-full h-24 bg-transparent border-none text-[11px] text-yellow-100/90 placeholder-yellow-600/50 focus:outline-none resize-none font-sans leading-relaxed"
        placeholder="Type quick thoughts, ideas or notes here..."
        value={note}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}
