"use client";

import { useRef, useState } from "react";

import type { OSApp } from "@/os/apps";

export function MobileAppView({
  app,
  onClose,
}: {
  app: OSApp;
  onClose: () => void;
}) {
  const startYRef = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [entered, setEntered] = useState(false);

  return (
    <div className="pointer-events-auto relative h-full w-full">
      <div
        className="h-full w-full"
        style={{
          transform: `translateY(${entered ? dragY : 18}px)`,
          opacity: entered ? 1 : 0,
          transition: isDragging
            ? undefined
            : "transform 220ms cubic-bezier(0.2,0.9,0.2,1), opacity 220ms ease",
        }}
        ref={(node) => {
          if (!node) return;
          if (entered) return;
          // trigger enter animation after mount
          requestAnimationFrame(() => setEntered(true));
        }}
      >
        <header className="px-5 pb-3 pt-6">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/25" />

          <div
            className="flex items-center justify-between"
            onPointerDown={(e) => {
              startYRef.current = e.clientY;
              setDragY(0);
              setIsDragging(true);
              (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              const startY = startYRef.current;
              if (startY == null) return;
              const dy = e.clientY - startY;
              setDragY(Math.max(0, dy));
            }}
            onPointerUp={() => {
              if (dragY > 120) onClose();
              startYRef.current = null;
              setDragY(0);
              setIsDragging(false);
            }}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="shrink-0">{app.icon}</div>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold tracking-tight text-white/90">
                  {app.name}
                </div>
                {app.subtitle ? (
                  <div className="truncate text-[11px] text-white/60">
                    {app.subtitle}
                  </div>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/12 bg-[rgba(10,10,12,0.62)] px-3 py-2 text-[12px] text-white/80 shadow-[0_18px_70px_rgba(0,0,0,0.55)]"
              aria-label="Close app"
            >
              Close
            </button>
          </div>
        </header>

        <div className="h-[calc(100%-92px)] px-5 pb-8">
          <div className="os-surface-2 h-full overflow-auto rounded-3xl p-4">
            {app.render()}
          </div>
        </div>
      </div>
    </div>
  );
}

