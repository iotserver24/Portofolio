"use client";

import { useMemo, useState } from "react";

import { useDesktopOS } from "@/components/os/state/DesktopOSContext";
import { appsById, pinnedApps } from "@/os/apps";

export function Dock() {
  const { windows, openApp, focusApp } = useDesktopOS();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [bouncingId, setBouncingId] = useState<string | null>(null);

  const items = useMemo(
    () =>
      pinnedApps
        .map((id) => appsById[id])
        .filter(Boolean)
        .map((app) => ({
          app,
          running: Boolean(windows[app.id]),
        })),
    [windows],
  );

  return (
    <nav
      aria-label="Dock"
      className="pointer-events-auto absolute bottom-5 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="flex items-end gap-2 rounded-3xl border border-white/12 bg-[rgba(10,10,12,0.62)] px-3 py-2 shadow-[0_18px_70px_rgba(0,0,0,0.55)]">
        {items.map(({ app, running }, index) => {
          const dist =
            hoveredIndex == null ? 999 : Math.abs(index - hoveredIndex);
          const scale =
            hoveredIndex == null
              ? 1
              : dist === 0
                ? 1.28
                : dist === 1
                  ? 1.14
                  : dist === 2
                    ? 1.06
                    : 1;

          const translateY =
            hoveredIndex == null
              ? 0
              : dist === 0
                ? -6
                : dist === 1
                  ? -3
                  : 0;

          const isBouncing = bouncingId === app.id;

          return (
          <button
            key={app.id}
            type="button"
            onClick={() => {
              if (running) {
                focusApp(app.id);
                return;
              }
              setBouncingId(app.id);
              openApp(app.id);
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            onAnimationEnd={() => {
              if (isBouncing) setBouncingId(null);
            }}
            className="group relative grid w-[56px] place-items-center rounded-2xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-white/20 hover:shadow-[0_14px_46px_rgba(0,0,0,0.55)]"
            aria-label={app.name}
            style={{
              transform: `translateY(${translateY}px) scale(${scale})`,
              transition:
                hoveredIndex == null
                  ? "transform 180ms ease"
                  : "transform 110ms cubic-bezier(0.2, 0.9, 0.2, 1)",
              transformOrigin: "center bottom",
              animation: isBouncing ? "osDockBounce 520ms ease" : undefined,
            }}
          >
            <div className="transition-transform duration-150">
              {app.icon}
            </div>
            {running ? (
              <span
                aria-hidden
                className="mt-1 block h-1 w-1 rounded-full bg-white/70"
              />
            ) : (
              <span aria-hidden className="mt-1 block h-1 w-1" />
            )}
          </button>
        );
        })}
      </div>
    </nav>
  );
}

