"use client";

import { useEffect, useMemo, useState } from "react";
import { useDesktopOS } from "@/components/os/state/DesktopOSContext";
import { type AppId, apps } from "@/os/apps";

function formatTime(d: Date, showSeconds = false) {
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    ...(showSeconds ? { second: "2-digit" } : {}),
  });
}

function formatDate(d: Date) {
  return d.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function MenuBar() {
  const [now, setNow] = useState<Date | null>(null);
  const [activeMenu, setActiveMenu] = useState<"portfolio" | "file" | "view" | "window" | "wifi" | "battery" | "calendar" | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Simulated Battery and Energy settings
  const [batteryPercent, setBatteryPercent] = useState(94);
  const [isCharging, setIsCharging] = useState(true);
  const [lowPowerMode, setLowPowerMode] = useState(false);

  const {
    openApp,
    closeApp,
    focusedAppId,
    windows,
    setPowerState,
    isWifiOnline,
    setWifiOnline,
    desktopIconsVisible,
    setDesktopIconsVisible,
    widgets,
    setWidgets,
    setIsUnlocked,
    minimizeApp,
    toggleMaximize,
  } = useDesktopOS();

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Update fullscreen state observer
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const time = useMemo(() => (now ? formatTime(now) : "--:--"), [now]);
  const dateText = useMemo(() => (now ? formatDate(now) : "---, --- --"), [now]);

  // Fullscreen toggler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
    setActiveMenu(null);
  };

  // Close active window helper
  const handleCloseFocusedWindow = () => {
    if (focusedAppId) {
      closeApp(focusedAppId);
    }
    setActiveMenu(null);
  };

  // Widget Toggler
  const handleWidgetToggle = (widgetId: string) => {
    if (widgets.includes(widgetId)) {
      setWidgets(widgets.filter((w) => w !== widgetId));
    } else {
      setWidgets([...widgets, widgetId]);
    }
  };

  // Minimize/Maximize focused window
  const handleMinimizeFocused = () => {
    if (focusedAppId) minimizeApp(focusedAppId);
    setActiveMenu(null);
  };

  const handleMaximizeFocused = () => {
    if (focusedAppId) toggleMaximize(focusedAppId);
    setActiveMenu(null);
  };

  // Minimize/Close All
  const handleMinimizeAll = () => {
    Object.keys(windows).forEach((id) => {
      minimizeApp(id as AppId);
    });
    setActiveMenu(null);
  };

  const handleCloseAll = () => {
    Object.keys(windows).forEach((id) => {
      closeApp(id as AppId);
    });
    setActiveMenu(null);
  };

  // Calendar Grid builder
  const renderMiniCalendar = () => {
    if (!now) return null;
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const today = now.getDate();

    // First day of current month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    // Spacers for previous month offset
    for (let i = 0; i < firstDay; i++) {
      days.push(<span key={`empty-${i}`} className="h-5 w-5 text-transparent">0</span>);
    }
    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      const isToday = i === today;
      days.push(
        <span
          key={`day-${i}`}
          className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono transition-colors ${
            isToday
              ? "bg-emerald-500 font-bold text-white shadow shadow-emerald-500/50"
              : "text-zinc-300 hover:bg-white/10"
          }`}
        >
          {i}
        </span>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-y-1 text-center font-sans">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="text-[9px] font-bold text-zinc-500">{d}</span>
        ))}
        {days}
      </div>
    );
  };

  return (
    <>
      {/* Click-outside Backdrop handler */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-50 cursor-default bg-transparent"
          onClick={() => setActiveMenu(null)}
        />
      )}

      {/* Actual Menu Bar layout */}
      <div className="pointer-events-auto absolute left-0 right-0 top-0 z-[60] h-[var(--os-menubar-h)] select-none">
        <div className="absolute inset-0 border-b border-white/10 bg-white/[0.04] backdrop-blur-[56px]" />
        
        <div className="relative mx-auto flex h-full w-full items-center justify-between px-4">
          
          {/* Left menu items */}
          <div className="flex items-center gap-1.5 text-[12px] font-semibold tracking-tight text-white/85">
            {/* Logo dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === "portfolio" ? null : "portfolio")}
                className={`rounded-md px-2.5 py-1 transition-all ${
                  activeMenu === "portfolio" ? "bg-white/10 text-white font-bold" : "hover:bg-white/5"
                }`}
              >
                 Portfolio
              </button>

              {activeMenu === "portfolio" && (
                <div className="absolute left-0 mt-1.5 w-52 rounded-xl border border-white/10 bg-zinc-900/90 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in">
                  <button
                    onClick={() => {
                      setShowAboutModal(true);
                      setActiveMenu(null);
                    }}
                    className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white/5"
                  >
                    About Megavault OS...
                  </button>
                  <button
                    onClick={() => {
                      openApp("settings");
                      setActiveMenu(null);
                    }}
                    className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white/5"
                  >
                    System Settings...
                  </button>
                  <div className="my-1 border-t border-white/10" />
                  <button
                    onClick={() => {
                      setIsUnlocked(false);
                      setActiveMenu(null);
                    }}
                    className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white/5"
                  >
                    Lock Screen
                  </button>
                  <button
                    onClick={() => {
                      setPowerState("restarting");
                      setActiveMenu(null);
                    }}
                    className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white/5"
                  >
                    Restart...
                  </button>
                  <button
                    onClick={() => {
                      setPowerState("shutdown");
                      setActiveMenu(null);
                    }}
                    className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    Shut Down...
                  </button>
                </div>
              )}
            </div>

            {/* File Menu */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === "file" ? null : "file")}
                className={`rounded-md px-2.5 py-1 transition-all ${
                  activeMenu === "file" ? "bg-white/10 text-white font-bold" : "hover:bg-white/5"
                }`}
              >
                File
              </button>
              {activeMenu === "file" && (
                <div className="absolute left-0 mt-1.5 w-48 rounded-xl border border-white/10 bg-zinc-900/90 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in">
                  <div className="px-2.5 py-1 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    Launch Application
                  </div>
                  {apps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        openApp(app.id);
                        setActiveMenu(null);
                      }}
                      className="w-full rounded-lg px-2.5 py-1 text-left text-xs transition-colors hover:bg-white/5"
                    >
                      Open {app.name}
                    </button>
                  ))}
                  <div className="my-1 border-t border-white/10" />
                  <button
                    onClick={handleCloseFocusedWindow}
                    disabled={!focusedAppId}
                    className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white/5 disabled:opacity-40"
                  >
                    Close Focused Window
                  </button>
                </div>
              )}
            </div>

            {/* View Menu */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === "view" ? null : "view")}
                className={`rounded-md px-2.5 py-1 transition-all ${
                  activeMenu === "view" ? "bg-white/10 text-white" : "hover:bg-white/5"
                }`}
              >
                View
              </button>
              {activeMenu === "view" && (
                <div className="absolute left-0 mt-1.5 w-52 rounded-xl border border-white/10 bg-zinc-900/90 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in">
                  <button
                    onClick={() => {
                      setDesktopIconsVisible(!desktopIconsVisible);
                      setActiveMenu(null);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white/5"
                  >
                    <span>Show Desktop Shortcuts</span>
                    <span className="font-semibold text-emerald-400">{desktopIconsVisible ? "Yes" : "No"}</span>
                  </button>
                  <div className="my-1 border-t border-white/10" />
                  <div className="px-2.5 py-1 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    Desktop Widgets
                  </div>
                  <button
                    onClick={() => handleWidgetToggle("clock")}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1 text-left text-xs transition-colors hover:bg-white/5"
                  >
                    <span>Digital/Analog Clock</span>
                    <span className="text-[10px] text-zinc-500">{widgets.includes("clock") ? "Visible" : "Hidden"}</span>
                  </button>
                  <button
                    onClick={() => handleWidgetToggle("sys-monitor")}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1 text-left text-xs transition-colors hover:bg-white/5"
                  >
                    <span>System Activity Monitor</span>
                    <span className="text-[10px] text-zinc-500">{widgets.includes("sys-monitor") ? "Visible" : "Hidden"}</span>
                  </button>
                  <button
                    onClick={() => handleWidgetToggle("notes")}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1 text-left text-xs transition-colors hover:bg-white/5"
                  >
                    <span>Sticky Notepad</span>
                    <span className="text-[10px] text-zinc-500">{widgets.includes("notes") ? "Visible" : "Hidden"}</span>
                  </button>
                  <div className="my-1 border-t border-white/10" />
                  <button
                    onClick={toggleFullscreen}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white/5"
                  >
                    <span>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</span>
                    <span className="text-[10px] text-zinc-500">F11</span>
                  </button>
                </div>
              )}
            </div>

            {/* Window Menu */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === "window" ? null : "window")}
                className={`rounded-md px-2.5 py-1 transition-all ${
                  activeMenu === "window" ? "bg-white/10 text-white" : "hover:bg-white/5"
                }`}
              >
                Window
              </button>
              {activeMenu === "window" && (
                <div className="absolute left-0 mt-1.5 w-48 rounded-xl border border-white/10 bg-zinc-900/90 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in">
                  <button
                    onClick={handleMinimizeFocused}
                    disabled={!focusedAppId}
                    className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white/5 disabled:opacity-40"
                  >
                    Minimize Focused
                  </button>
                  <button
                    onClick={handleMaximizeFocused}
                    disabled={!focusedAppId}
                    className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white/5 disabled:opacity-40"
                  >
                    Maximize Focused
                  </button>
                  <button
                    onClick={handleMinimizeAll}
                    className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white/5"
                  >
                    Minimize All Windows
                  </button>
                  <button
                    onClick={handleCloseAll}
                    className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    Close All Windows
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right menu items */}
          <div className="flex items-center gap-1.5 text-[12px] text-white/85">
            {/* Wi-Fi Widget dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === "wifi" ? null : "wifi")}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-all ${
                  activeMenu === "wifi" ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/75"
                }`}
              >
                {/* Custom inline WiFi SVG using currentColor */}
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {isWifiOnline ? (
                    <>
                      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                      <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
                    </>
                  ) : (
                    <>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />
                      <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" className="opacity-40" />
                    </>
                  )}
                </svg>
                <span className="hidden sm:inline">{isWifiOnline ? "Online" : "Offline"}</span>
              </button>

              {activeMenu === "wifi" && (
                <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-white/10 bg-zinc-900/95 p-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/95">Wi-Fi Wireless</span>
                    <button
                      onClick={() => setWifiOnline(!isWifiOnline)}
                      className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                        isWifiOnline ? "bg-emerald-500" : "bg-zinc-700"
                      }`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        isWifiOnline ? "translate-x-4" : "translate-x-0.5"
                      }`} />
                    </button>
                  </div>
                  <div className="border-t border-white/5 pt-2 text-[10px] space-y-1.5 text-zinc-400">
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span className={isWifiOnline ? "text-emerald-400 font-semibold" : "text-zinc-500 font-medium"}>
                        {isWifiOnline ? "Connected" : "Disconnected"}
                      </span>
                    </div>
                    {isWifiOnline && (
                      <>
                        <div className="flex justify-between">
                          <span>Network Node</span>
                          <span className="text-zinc-200">megavault-node-ap</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Latency</span>
                          <span className="text-zinc-200">12 ms</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Battery Widget dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === "battery" ? null : "battery")}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-all ${
                  activeMenu === "battery" ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/75"
                }`}
              >
                {/* Custom inline Battery SVG */}
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
                  <line x1="22" y1="11" x2="22" y2="13" />
                  {batteryPercent > 10 && (
                    <line
                      x1="5"
                      y1="12"
                      x2={5 + Math.round((batteryPercent / 100) * 10)}
                      y2="12"
                      strokeWidth="4"
                      className={batteryPercent < 20 ? "stroke-red-400" : "stroke-emerald-400"}
                    />
                  )}
                </svg>
                <span className="hidden sm:inline">{batteryPercent}%</span>
              </button>

              {activeMenu === "battery" && (
                <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-white/10 bg-zinc-900/95 p-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in space-y-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-white/95">Power Source</span>
                    <div className="text-[10px] text-zinc-400">{isCharging ? "Power Adapter (Charging)" : "Battery Mode"}</div>
                  </div>
                  
                  <div className="border-t border-white/5 pt-2 text-[10px] space-y-1.5 text-zinc-400">
                    <div className="flex justify-between">
                      <span>Percentage Charge</span>
                      <span className="font-semibold text-zinc-200">{batteryPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Battery Health</span>
                      <span className="text-emerald-400">100% (Normal)</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span>Energy Saver (LPM)</span>
                      <button
                        onClick={() => {
                          setLowPowerMode(!lowPowerMode);
                          if (!lowPowerMode) {
                            setBatteryPercent(89);
                            setIsCharging(false);
                          } else {
                            setBatteryPercent(94);
                            setIsCharging(true);
                          }
                        }}
                        className={`relative inline-flex h-3.5 w-7 items-center rounded-full transition-colors ${
                          lowPowerMode ? "bg-emerald-500" : "bg-zinc-700"
                        }`}
                      >
                        <span className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                          lowPowerMode ? "translate-x-3.5" : "translate-x-0.5"
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Date/Time dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === "calendar" ? null : "calendar")}
                className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                  activeMenu === "calendar" ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/85"
                }`}
              >
                {time}
              </button>

              {activeMenu === "calendar" && (
                <div className="absolute right-0 mt-1.5 w-64 rounded-2xl border border-white/10 bg-zinc-900/95 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in space-y-3">
                  <div className="border-b border-white/5 pb-2 text-center">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                      {dateText}
                    </div>
                    <div className="text-[20px] font-mono font-semibold text-white/95 mt-0.5">
                      {now ? formatTime(now, true) : "--:--:--"}
                    </div>
                  </div>
                  {renderMiniCalendar()}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Beautiful System Specs Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm select-text">
          <div className="relative w-[min(480px,94vw)] rounded-[24px] border border-white/12 bg-zinc-900/90 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute right-4 top-4 rounded-full bg-white/5 p-1 text-zinc-400 transition-colors hover:bg-white/15 hover:text-white"
              aria-label="Close modal"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col items-center gap-4 text-center">
              {/* Virtual avatar/chip logo */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 p-[1px] shadow-lg shadow-emerald-500/20">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-zinc-950 font-mono text-xl font-black text-emerald-400">
                  MV
                </div>
              </div>

              <div>
                <h2 className="text-md font-bold tracking-tight text-white/95">Megavault OS Enterprise</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5 font-bold">Virtual Node Version 24.110.82</p>
              </div>

              <div className="os-surface w-full divide-y divide-zinc-800/40 rounded-xl px-4 py-1 text-[11px] text-zinc-400">
                <div className="flex justify-between py-2">
                  <span className="text-zinc-500">Virtual Host Chip</span>
                  <span className="font-semibold text-zinc-200">Megavault Core Neural x8</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-zinc-500">Memory Allocation</span>
                  <span className="font-semibold text-zinc-200">16.0 GB Virtual RAM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-zinc-500">Active Storage Buckets</span>
                  <span className="font-semibold text-zinc-200">100 GB Megavault S3</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-zinc-500">System Developer</span>
                  <span className="font-semibold text-emerald-400">Anish Kumar</span>
                </div>
              </div>

              <p className="text-[10px] text-zinc-500 leading-relaxed max-w-[320px]">
                Built as a web-contained virtual environment using Next.js App Router and reactive window shaders. All assets licensed to Megavault Corp.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
