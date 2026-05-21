"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Dock } from "@/components/os/dock/Dock";
import { DesktopIcons } from "@/components/os/desktop/DesktopIcons";
import { DesktopWindowManager } from "@/components/os/desktop/DesktopWindowManager";
import { MenuBar } from "@/components/os/desktop/MenuBar";
import { DesktopLoginScreen } from "@/components/os/lock/DesktopLoginScreen";
import { MobileLockScreen } from "@/components/os/lock/MobileLockScreen";
import { MobileHome } from "@/components/os/mobile/MobileHome";
import { MobileAppView } from "@/components/os/mobile/MobileAppView";
import { Wallpaper } from "@/components/os/wallpaper/Wallpaper";
import { type AppId, appsById, pinnedApps } from "@/os/apps";
import { DesktopOSProvider, useDesktopOS } from "@/components/os/state/DesktopOSContext";
import { DesktopWidgets } from "@/components/os/desktop/DesktopWidgets";

type MobileState =
  | { kind: "home" }
  | { kind: "app"; appId: AppId };

function useIsMobileBreakpoint() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    const mqNoHover = window.matchMedia("(hover: none)");
    const update = () => {
      const touchy = navigator.maxTouchPoints > 0 || mqCoarse.matches || mqNoHover.matches;
      const w = window.innerWidth;
      setIsMobile(w <= 820 || (touchy && w <= 1024));
    };
    update();
    window.addEventListener("resize", update);
    mqCoarse.addEventListener("change", update);
    mqNoHover.addEventListener("change", update);
    return () => {
      window.removeEventListener("resize", update);
      mqCoarse.removeEventListener("change", update);
      mqNoHover.removeEventListener("change", update);
    };
  }, []);

  return isMobile;
}

export function OSShell() {
  return (
    <DesktopOSProvider>
      <OSShellInner />
    </DesktopOSProvider>
  );
}

function OSShellInner() {
  const isMobile = useIsMobileBreakpoint();
  const [mobileState, setMobileState] = useState<MobileState>({ kind: "home" });
  const searchParams = useSearchParams();
  const requestedApp = searchParams.get("app");

  const { wallpaper, passcode, powerState, setPowerState, isUnlocked, setIsUnlocked } = useDesktopOS();

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

  // Handle booting and restarting sequences
  useEffect(() => {
    if (powerState === "restarting") {
      const t = setTimeout(() => {
        setPowerState("booting");
      }, 2000);
      return () => clearTimeout(t);
    }
    if (powerState === "booting") {
      const t = setTimeout(() => {
        setPowerState("running");
        setIsUnlocked(false); // force relocking
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [powerState, setPowerState]);

  // Determine active background source
  const wallpaperSrc = useMemo(() => {
    if (wallpaper === "/bg.mp4") {
      return isMobile ? "/mb_bg.mp4" : "/bg.mp4";
    }
    return wallpaper;
  }, [wallpaper, isMobile]);

  // 1. SHUT DOWN STATE
  if (powerState === "shutdown") {
    return (
      <div className="relative flex h-dvh w-full flex-col items-center justify-center bg-[#050507] text-white">
        <button
          type="button"
          onClick={() => setPowerState("booting")}
          className="group relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] shadow-[0_0_50px_rgba(255,255,255,0.02)] transition-all duration-300 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:shadow-[0_0_50px_rgba(16,185,129,0.2)]"
          aria-label="Power on system"
        >
          <svg
            className="h-10 w-10 text-white/50 transition-colors group-hover:text-emerald-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
          <span className="absolute -bottom-8 whitespace-nowrap text-[11px] font-medium tracking-widest text-white/30 group-hover:text-emerald-400">
            CLICK TO POWER ON
          </span>
        </button>
      </div>
    );
  }

  // 2. RESTARTING / BOOTING SCREEN
  if (powerState === "restarting" || powerState === "booting") {
    return (
      <div className="relative flex h-dvh w-full flex-col items-center justify-center bg-[#07070a] text-white">
        <div className="relative flex flex-col items-center gap-6">
          {/* Custom pulsing loading indicator */}
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-white/5" />
            <div className="absolute inset-0 rounded-full border-2 border-t-white/80 animate-spin" />
          </div>
          <span className="text-[12px] font-medium tracking-widest text-white/60">
            {powerState === "restarting" ? "RESTARTING SYSTEM..." : "BOOTING MEVAGAVAULT OS..."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="os-root relative min-h-dvh w-full overflow-hidden bg-black text-white">
      <Wallpaper src={wallpaperSrc} />

      <div className="relative z-10 h-dvh w-full">
        {!isUnlocked ? (
          isMobile ? (
            <MobileLockScreen
              imageSrc="/mb_loc.png"
              onUnlock={() => setIsUnlocked(true)}
              passcode={passcode}
            />
          ) : (
            <DesktopLoginScreen
              imageSrc="/loc.png"
              onUnlock={() => setIsUnlocked(true)}
              passcode={passcode}
            />
          )
        ) : isMobile ? (
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
            <DesktopWidgets />
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

