"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { type AppId, appsById, pinnedApps } from "@/os/apps";

export type WindowRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type WindowState = {
  appId: AppId;
  title: string;
  rect: WindowRect;
  minimized: boolean;
  maximized: boolean;
  phase: "open" | "minimizing" | "closing";
  z: number;
};

type DesktopOSState = {
  windows: Partial<Record<AppId, WindowState>>;
  focusedAppId: AppId | null;
};

type DesktopOSActions = {
  openApp: (appId: AppId) => void;
  closeApp: (appId: AppId) => void;
  focusApp: (appId: AppId) => void;
  minimizeApp: (appId: AppId) => void;
  toggleMaximize: (appId: AppId) => void;
  setRect: (appId: AppId, rect: WindowRect) => void;
};

const DesktopOSContext = createContext<
  (DesktopOSState & DesktopOSActions) | null
>(null);

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function defaultRectFor(appId: AppId, index: number): WindowRect {
  const baseW = 860;
  const baseH = 560;
  const offset = 34;

  const x = 120 + index * offset;
  const y = 80 + index * offset;
  const w = baseW - index * 12;
  const h = baseH - index * 10;

  return { x, y, w, h };
}

export function DesktopOSProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DesktopOSState>({
    windows: {},
    focusedAppId: null,
  });

  const nextZRef = useRef(10);
  const phaseTimersRef = useRef<Record<string, number>>({});

  const clearPhaseTimer = useCallback((appId: AppId) => {
    const key = String(appId);
    const timer = phaseTimersRef.current[key];
    if (!timer) return;
    window.clearTimeout(timer);
    delete phaseTimersRef.current[key];
  }, []);

  const openApp = useCallback((appId: AppId) => {
    setState((prev) => {
      const existing = prev.windows[appId];
      const z = (nextZRef.current += 1);
      if (existing) {
        return {
          windows: {
            ...prev.windows,
            [appId]: { ...existing, minimized: false, phase: "open", z },
          },
          focusedAppId: appId,
        };
      }

      const index = Object.keys(prev.windows).length;
      const rect = defaultRectFor(appId, index);

      return {
        windows: {
          ...prev.windows,
          [appId]: {
            appId,
            title: appsById[appId]?.name ?? appId,
            rect,
            minimized: false,
            maximized: false,
            phase: "open",
            z,
          },
        },
        focusedAppId: appId,
      };
    });
  }, []);

  const closeApp = useCallback((appId: AppId) => {
    clearPhaseTimer(appId);
    setState((prev) => {
      const win = prev.windows[appId];
      if (!win) return prev;
      return {
        windows: { ...prev.windows, [appId]: { ...win, phase: "closing", minimized: false } },
        focusedAppId: prev.focusedAppId === appId ? null : prev.focusedAppId,
      };
    });
    phaseTimersRef.current[String(appId)] = window.setTimeout(() => {
      setState((prev) => {
        const rest = { ...prev.windows };
        delete rest[appId];
        const focusedAppId =
          prev.focusedAppId === appId ? null : prev.focusedAppId;
        return { windows: rest, focusedAppId };
      });
      clearPhaseTimer(appId);
    }, 190);
  }, []);

  const focusApp = useCallback((appId: AppId) => {
    clearPhaseTimer(appId);
    setState((prev) => {
      const win = prev.windows[appId];
      if (!win) return prev;
      const z = (nextZRef.current += 1);
      return {
        windows: {
          ...prev.windows,
          [appId]: { ...win, minimized: false, phase: "open", z },
        },
        focusedAppId: appId,
      };
    });
  }, []);

  const minimizeApp = useCallback((appId: AppId) => {
    clearPhaseTimer(appId);
    setState((prev) => {
      const win = prev.windows[appId];
      if (!win) return prev;
      return {
        windows: {
          ...prev.windows,
          [appId]: { ...win, minimized: false, phase: "minimizing" },
        },
        focusedAppId: prev.focusedAppId === appId ? null : prev.focusedAppId,
      };
    });
    phaseTimersRef.current[String(appId)] = window.setTimeout(() => {
      setState((prev) => {
        const win = prev.windows[appId];
        if (!win) return prev;
        return {
          ...prev,
          windows: {
            ...prev.windows,
            [appId]: { ...win, minimized: true, phase: "open" },
          },
        };
      });
      clearPhaseTimer(appId);
    }, 190);
  }, []);

  const toggleMaximize = useCallback((appId: AppId) => {
    clearPhaseTimer(appId);
    setState((prev) => {
      const win = prev.windows[appId];
      if (!win) return prev;
      return {
        windows: {
          ...prev.windows,
          [appId]: { ...win, maximized: !win.maximized, minimized: false, phase: "open" },
        },
        focusedAppId: appId,
      };
    });
  }, []);

  const setRect = useCallback((appId: AppId, rect: WindowRect) => {
    setState((prev) => {
      const win = prev.windows[appId];
      if (!win) return prev;
      const next = {
        x: clamp(rect.x, -40, 2000),
        y: clamp(rect.y, -20, 2000),
        w: clamp(rect.w, 360, 1600),
        h: clamp(rect.h, 260, 1200),
      };
      return {
        ...prev,
        windows: { ...prev.windows, [appId]: { ...win, rect: next } },
      };
    });
  }, []);

  useEffect(() => {
    return () => {
      Object.values(phaseTimersRef.current).forEach((t) => window.clearTimeout(t));
      phaseTimersRef.current = {};
    };
  }, []);

  // Boot the desktop with a default window.
  // (Keeps the desktop from feeling empty on first load.)
  const bootedRef = useRef(false);
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    openApp(pinnedApps[0] ?? "overview");
  }, [openApp]);

  const value = useMemo(
    () => ({
      ...state,
      openApp,
      closeApp,
      focusApp,
      minimizeApp,
      toggleMaximize,
      setRect,
    }),
    [state, openApp, closeApp, focusApp, minimizeApp, toggleMaximize, setRect],
  );

  return (
    <DesktopOSContext.Provider value={value}>
      {children}
    </DesktopOSContext.Provider>
  );
}

export function useDesktopOS() {
  const ctx = useContext(DesktopOSContext);
  if (!ctx) {
    throw new Error("useDesktopOS must be used within DesktopOSProvider");
  }
  return ctx;
}

