"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { OSWindow } from "@/components/os/desktop/OSWindow";
import { DesktopOSProvider, useDesktopOS } from "@/components/os/state/DesktopOSContext";
import { appsById } from "@/os/apps";

function DesktopStage({ children }: { children: ReactNode }) {
  const { windows, focusedAppId, closeApp, focusApp, minimizeApp, toggleMaximize, setRect } =
    useDesktopOS();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === "w") {
        e.preventDefault();
        if (focusedAppId) closeApp(focusedAppId);
      }
      if (e.key === "Escape") {
        if (focusedAppId) minimizeApp(focusedAppId);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusedAppId, closeApp, minimizeApp]);

  const ordered = Object.values(windows).sort((a, b) => a.z - b.z);

  return (
    <div className="relative h-full w-full">
      {children}

      {ordered.map((win) => {
        if (win.minimized) return null;
        const app = appsById[win.appId];
        if (!app) return null;

        return (
          <OSWindow
            key={win.appId}
            appId={win.appId}
            title={win.title}
            focused={focusedAppId === win.appId}
            rect={win.rect}
            maximized={win.maximized}
            phase={win.phase}
            zIndex={win.z}
            onClose={() => closeApp(win.appId)}
            onFocus={() => focusApp(win.appId)}
            onMinimize={() => minimizeApp(win.appId)}
            onToggleMaximize={() => toggleMaximize(win.appId)}
            onRectChange={(rect) => setRect(win.appId, rect)}
          >
            <div className="p-4">{app.render({ kind: "desktop" })}</div>
          </OSWindow>
        );
      })}
    </div>
  );
}

export function DesktopWindowManager({ children }: { children: ReactNode }) {
  return (
    <DesktopOSProvider>
      <DesktopStage>{children}</DesktopStage>
    </DesktopOSProvider>
  );
}

