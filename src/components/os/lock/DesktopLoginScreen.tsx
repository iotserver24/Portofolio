"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatTime(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function DesktopLoginScreen({
  imageSrc = "/loc.png",
  onUnlock,
}: {
  imageSrc?: string;
  onUnlock: () => void;
}) {
  const [now, setNow] = useState(() => new Date());
  const [phase, setPhase] = useState<"typing" | "done">("typing");
  const [typed, setTyped] = useState(0);
  const hasUnlockedRef = useRef(false);

  const passwordMask = useMemo(() => "••••••••", []);
  const displayName = "R43AP3R editz";
  const avatarSrc = "/Photo.png";

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 10_000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (typed >= passwordMask.length) {
      setPhase("done");
      return;
    }
    const t = window.setTimeout(() => setTyped((n) => n + 1), 110);
    return () => window.clearTimeout(t);
  }, [phase, passwordMask.length, typed]);

  useEffect(() => {
    if (phase !== "done") return;
    if (hasUnlockedRef.current) return;
    hasUnlockedRef.current = true;
    const t = window.setTimeout(() => onUnlock(), 260);
    return () => window.clearTimeout(t);
  }, [onUnlock, phase]);

  return (
    <div className="absolute inset-0 z-50 grid place-items-center overflow-hidden bg-black text-white">
      <img
        src={imageSrc}
        alt="Login screen"
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />

      <div className="relative w-[min(560px,92vw)] rounded-[28px] border border-white/12 bg-black/35 p-7 shadow-[0_30px_140px_rgba(0,0,0,0.65)] backdrop-blur">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-[46px] font-semibold tracking-tight leading-none">
              {formatTime(now)}
            </div>
            <div className="mt-1 text-[13px] text-white/65">Login</div>
          </div>
          <div className="text-right text-[12px] text-white/55">Secure session</div>
        </div>

        <div className="mt-9 flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/5">
            <img
              src={avatarSrc}
              alt={`${displayName} avatar`}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
          <div className="min-w-0">
            <div className="truncate text-[16px] font-semibold tracking-tight text-white/90">
              {displayName}
            </div>
            <div className="mt-0.5 text-[12px] text-white/55">
              Password autofill
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="rounded-2xl border border-white/12 bg-black/45 px-4 py-3">
            <div className="text-[12px] text-white/65">Password</div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="font-mono text-[14px] tracking-[0.22em] text-white/90">
                {passwordMask.slice(0, typed)}
                <span className="text-white/25">{passwordMask.slice(typed)}</span>
              </div>
              <div className="text-[12px] text-white/55">
                {phase === "typing" ? "typing…" : "unlocked"}
              </div>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-white/45" />
        </div>
      </div>
    </div>
  );
}

