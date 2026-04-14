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

  return (
    <div className="pointer-events-auto h-full w-full">
      <div className="mx-auto flex h-full max-w-md flex-col px-5 pb-6 pt-6">
        <div className="flex items-center justify-between text-[12px] text-white/80">
          <div className="font-medium tracking-tight">Portfolio OS</div>
          <div className="text-white/60">iotserver24</div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-5">
          {resolved.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => onOpenApp(app.id)}
              className="flex flex-col items-center gap-2 rounded-2xl px-2 py-2 outline-none focus-visible:ring-2 focus-visible:ring-white/20 active:scale-[0.98]"
              aria-label={`Open ${app.name}`}
            >
              {app.icon}
              <div className="text-center text-[11px] font-medium tracking-tight text-white/85">
                {app.name}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-10">
          <div className="rounded-3xl border border-white/12 bg-[rgba(10,10,12,0.62)] px-4 py-3 text-[11px] text-white/75 shadow-[0_18px_70px_rgba(0,0,0,0.55)]">
            Tap an app to open. Swipe down in an app to close.
          </div>
        </div>
      </div>
    </div>
  );
}

