"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Dock } from "@/components/os/dock/Dock";
import { DesktopIcons } from "@/components/os/desktop/DesktopIcons";
import { DesktopWindowManager } from "@/components/os/desktop/DesktopWindowManager";
import { MenuBar } from "@/components/os/desktop/MenuBar";
import { MobileHome } from "@/components/os/mobile/MobileHome";
import { MobileAppView } from "@/components/os/mobile/MobileAppView";
import { Wallpaper } from "@/components/os/wallpaper/Wallpaper";
import { type AppId, appsById, pinnedApps } from "@/os/apps";
import { useDesktopOS } from "@/components/os/state/DesktopOSContext";

type MobileState =
  | { kind: "home" }
  | { kind: "app"; appId: AppId };

function useIsMobileBreakpoint() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    const update = () =>
      setIsMobile(window.innerWidth <= 820 || mqCoarse.matches);
    update();
    window.addEventListener("resize", update);
    mqCoarse.addEventListener("change", update);
    return () => {
      window.removeEventListener("resize", update);
      mqCoarse.removeEventListener("change", update);
    };
  }, []);

  return isMobile;
}

export function OSShell() {
  const isMobile = useIsMobileBreakpoint();
  const [mobileState, setMobileState] = useState<MobileState>({ kind: "home" });
  const searchParams = useSearchParams();
  const requestedApp = searchParams.get("app");

  const requestedAppId = useMemo(() => {
    if (!requestedApp) return null;
    const maybe = requestedApp as AppId;
    return appsById[maybe] ? maybe : null;
  }, [requestedApp]);

  const mobileApp = useMemo(() => {
    if (mobileState.kind !== "app") return null;
    return appsById[mobileState.appId];
  }, [mobileState]);

  useEffect(() => {
    if (!isMobile) return;
    if (!requestedAppId) return;
    setMobileState({ kind: "app", appId: requestedAppId });
  }, [isMobile, requestedAppId]);

  return (
    <div className="os-root relative min-h-dvh w-full overflow-hidden bg-black text-white">
      <Wallpaper src={isMobile ? "/mb_bg.mp4" : "/bg.mp4"} />

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
            <MenuBar />
            <DesktopIcons />
            {requestedAppId ? <DesktopQueryOpener appId={requestedAppId} /> : null}
            <Dock />
          </DesktopWindowManager>
        )}
      </div>
    </div>
  );
}

function DesktopQueryOpener({ appId }: { appId: AppId }) {
  const { openApp } = useDesktopOS();

  useEffect(() => {
    openApp(appId);
  }, [appId, openApp]);

  return null;
}

