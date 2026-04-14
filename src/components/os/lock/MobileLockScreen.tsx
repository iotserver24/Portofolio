"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatTime(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function MobileLockScreen({
  imageSrc = "/mb_loc.png",
  onUnlock,
}: {
  imageSrc?: string;
  onUnlock: () => void;
}) {
  const [now, setNow] = useState(() => new Date());
  const startYRef = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [entered, setEntered] = useState(false);

  const hint = useMemo(() => "Swipe up to open", []);

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 10_000);
    return () => window.clearInterval(t);
  }, []);

  const endDrag = (unlock: boolean) => {
    startYRef.current = null;
    setIsDragging(false);
    if (unlock) {
      onUnlock();
      return;
    }
    setDragY(0);
  };

  return (
    <div className="absolute inset-0 z-50 overflow-hidden bg-black text-white">
      <img
        src={imageSrc}
        alt="Lock screen"
        className="absolute inset-0 h-full w-full object-cover opacity-95"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/70" />

      <div
        className="relative h-full w-full touch-none"
        style={{
          transform: `translateY(${entered ? -dragY : 0}px)`,
          transition: isDragging ? undefined : "transform 220ms cubic-bezier(0.2,0.9,0.2,1)",
          touchAction: "none",
        }}
        ref={(node) => {
          if (!node) return;
          if (entered) return;
          requestAnimationFrame(() => setEntered(true));
        }}
        onPointerDown={(e) => {
          if (!e.isPrimary) return;
          startYRef.current = e.clientY;
          setDragY(0);
          setIsDragging(true);
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const startY = startYRef.current;
          if (startY == null) return;
          const dy = startY - e.clientY; // swipe up => positive
          setDragY(Math.max(0, Math.min(320, dy)));
        }}
        onPointerUp={() => endDrag(dragY > 140)}
        onPointerCancel={() => endDrag(false)}
      >
        <div className="px-6 pt-16">
          <div className="text-[58px] font-semibold tracking-tight leading-none">
            {formatTime(now)}
          </div>
          <div className="mt-2 text-[13px] text-white/70">Swipe up</div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-3 px-6">
          <div className="h-1 w-16 rounded-full bg-white/25" />
          <div className="text-[12px] font-medium text-white/70">{hint}</div>
        </div>
      </div>
    </div>
  );
}

