"use client";

import type { AppId, OSApp } from "@/os/apps";
import { appsById } from "@/os/apps";

export function MobileHome({
  apps,
  onOpenApp,
}: {
  apps: AppId[];
  onOpenApp: (appId: AppId) => void;
}) {
  const resolved: OSApp[] = apps.map((id) => appsById[id]).filter(Boolean);
  const dock = resolved.slice(0, 4);
  const grid = resolved.slice(0, 12);

  return (
    <div className="pointer-events-auto relative h-full w-full px-5 pb-8 pt-3">
      {/* iOS-ish status bar */}
      <div className="flex items-center justify-between px-1 pt-2 text-[12px] font-medium text-white/85">
        <div className="tracking-tight">9:41</div>
        <div className="flex items-center gap-2 text-white/70">
          <span>Wi‑Fi</span>
          <span>▮▮▮</span>
        </div>
      </div>

      {/* Home grid */}
      <div className="mx-auto mt-8 w-[min(420px,100%)]">
        <div className="grid grid-cols-4 gap-x-5 gap-y-6">
          {grid.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => onOpenApp(app.id)}
              className="flex flex-col items-center gap-2 rounded-2xl px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-white/20 active:scale-[0.98]"
              aria-label={`Open ${app.name}`}
            >
              {app.icon}
              <div className="max-w-[76px] truncate text-center text-[11px] font-medium tracking-tight text-white/90">
                {app.name}
              </div>
            </button>
          ))}
        </div>

        {/* Page dots */}
        <div className="mt-6 flex items-center justify-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
        </div>
      </div>

      {/* iOS dock */}
      <div className="absolute bottom-6 left-1/2 w-[min(420px,calc(100vw-40px))] -translate-x-1/2">
        <div className="rounded-[28px] border border-white/14 bg-[rgba(255,255,255,0.10)] px-4 py-3 shadow-[0_30px_120px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
          <div className="flex items-end justify-between">
            {dock.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => onOpenApp(app.id)}
                className="flex flex-col items-center gap-1 rounded-2xl px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-white/20 active:scale-[0.98]"
                aria-label={`Open ${app.name}`}
              >
                {app.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

