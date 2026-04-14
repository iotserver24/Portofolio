"use client";

import { useEffect, useMemo, useState } from "react";

import { Dock } from "@/components/os/dock/Dock";
import { DesktopIcons } from "@/components/os/desktop/DesktopIcons";
import { DesktopWindowManager } from "@/components/os/desktop/DesktopWindowManager";
import { MobileHome } from "@/components/os/mobile/MobileHome";
import { MobileAppView } from "@/components/os/mobile/MobileAppView";
import { Wallpaper } from "@/components/os/wallpaper/Wallpaper";
import { type AppId, appsById, pinnedApps } from "@/os/apps";

type MobileState =
  | { kind: "home" }
  | { kind: "app"; appId: AppId };

function useIsMobileBreakpoint() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export function OSShell() {
  const isMobile = useIsMobileBreakpoint();
  const [mobileState, setMobileState] = useState<MobileState>({ kind: "home" });

  const mobileApp = useMemo(() => {
    if (mobileState.kind !== "app") return null;
    return appsById[mobileState.appId];
  }, [mobileState]);

  return (
    <div className="os-root relative min-h-dvh w-full overflow-hidden bg-black text-white">
      <Wallpaper src="/bg.mp4" />

      <div className="relative z-10 h-dvh w-full">
        {isMobile ? (
          <div className="h-full w-full">
            {mobileState.kind === "home" ? (
              <MobileHome
                apps={pinnedApps}
                onOpenApp={(appId) => setMobileState({ kind: "app", appId })}
              />
            ) : mobileApp ? (
              <MobileAppView
                app={mobileApp}
                onClose={() => setMobileState({ kind: "home" })}
              />
            ) : (
              <MobileHome
                apps={pinnedApps}
                onOpenApp={(appId) => setMobileState({ kind: "app", appId })}
              />
            )}
          </div>
        ) : (
          <DesktopWindowManager>
            <DesktopIcons />
            <Dock />
          </DesktopWindowManager>
        )}
      </div>
    </div>
  );
}

