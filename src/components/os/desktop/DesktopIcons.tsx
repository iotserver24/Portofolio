"use client";

import { appsById, pinnedApps } from "@/os/apps";
import { useDesktopOS } from "@/components/os/state/DesktopOSContext";

export function DesktopIcons() {
  const { openApp } = useDesktopOS();

  return (
    <div className="pointer-events-auto absolute left-1/2 top-[calc(var(--os-menubar-h)+28px)] w-[min(720px,calc(100vw-40px))] -translate-x-1/2">
      <div className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 lg:block">
        <div className="pointer-events-auto rounded-[22px] border border-white/12 bg-[rgba(255,255,255,0.08)] p-2 shadow-[0_30px_120px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
          <img
            src="/Photo.png"
            alt="Photo"
            className="h-[220px] w-[220px] rounded-[18px] object-cover"
            draggable={false}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-7 sm:grid-cols-4 md:grid-cols-6">
      {pinnedApps.slice(0, 6).map((id) => {
        const app = appsById[id];
        if (!app) return null;
        return (
          <button
            key={app.id}
            type="button"
            onDoubleClick={() => openApp(app.id)}
            onClick={() => {}}
            className="group flex flex-col items-center gap-2 rounded-2xl px-2 py-2 outline-none focus-visible:ring-2 focus-visible:ring-white/20 active:scale-[0.99]"
            aria-label={`Open ${app.name}`}
          >
            <div className="transition-transform duration-150 group-hover:-translate-y-0.5">
              {app.icon}
            </div>
            <div className="text-center text-[11px] font-medium tracking-tight text-white/85">
              {app.name}
            </div>
          </button>
        );
      })}
      </div>
      <div className="mt-6 flex items-center justify-center">
        <div className="pointer-events-auto rounded-full border border-white/12 bg-[rgba(10,10,12,0.54)] px-4 py-2 text-[11px] text-white/70 shadow-[0_18px_70px_rgba(0,0,0,0.45)]">
          Double‑click an icon to open. <span className="font-semibold">Esc</span> minimizes,
          <span className="font-semibold"> Ctrl/Cmd+W</span> closes.
        </div>
      </div>
    </div>
  );
}

