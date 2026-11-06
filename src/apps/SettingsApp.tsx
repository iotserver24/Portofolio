"use client";

import { useState } from "react";
import { useDesktopOS } from "@/components/os/state/DesktopOSContext";

export function SettingsApp() {
  const {
    wallpaper,
    setWallpaper,
    widgets,
    setWidgets,
    isWifiOnline,
    setWifiOnline,
    passcode,
    setPasscode,
    desktopIconsVisible,
    setDesktopIconsVisible,
  } = useDesktopOS();

  const [activeTab, setActiveTab] = useState<"personalization" | "security" | "network" | "system">("personalization");
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");

  const wallpapers = [
    { id: "/bg.mp4", name: "Cyber Aurora (Video)", preview: "bg-emerald-950 border-emerald-500/30" },
    { id: "gradient-aurora", name: "Emerald Dream", preview: "bg-gradient-to-br from-[#0c1f1a] to-[#1a1130]" },
    { id: "gradient-sunset", name: "Cosmic Sunset", preview: "bg-gradient-to-br from-[#291122] to-[#0f1d3a]" },
    { id: "gradient-neon", name: "Neon Nocturnal", preview: "bg-gradient-to-br from-[#210931] to-[#09212d]" },
    { id: "carbon", name: "Carbon Mesh Grid", preview: "bg-zinc-900 border-zinc-700/50" },
  ];

  const handleWidgetToggle = (widgetId: string) => {
    if (widgets.includes(widgetId)) {
      setWidgets(widgets.filter((w) => w !== widgetId));
    } else {
      setWidgets([...widgets, widgetId]);
    }
  };

  const handleSaveCustomWallpaper = () => {
    if (customWallpaperUrl.trim()) {
      setWallpaper(customWallpaperUrl.trim());
    }
  };

  const handleSavePin = () => {
    if (pinInput.length === 4 && /^\d+$/.test(pinInput)) {
      setPasscode(pinInput);
      setPinInput("");
      setSecurityMessage("Passcode PIN set successfully!");
      setTimeout(() => setSecurityMessage(""), 3000);
    } else {
      setSecurityMessage("Error: PIN must be exactly 4 digits.");
      setTimeout(() => setSecurityMessage(""), 3000);
    }
  };

  const handleRemovePin = () => {
    setPasscode(null);
    setPinInput("");
    setSecurityMessage("Passcode security disabled.");
    setTimeout(() => setSecurityMessage(""), 3000);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden text-white md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="flex flex-row border-zinc-800 bg-white/[0.01] p-2 md:w-48 md:flex-col md:border-r md:p-3">
        <button
          onClick={() => setActiveTab("personalization")}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-all ${
            activeTab === "personalization"
              ? "bg-white/10 text-white shadow-sm"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          } flex-1 md:flex-none`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Personalization
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-all ${
            activeTab === "security"
              ? "bg-white/10 text-white shadow-sm"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          } flex-1 md:flex-none`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Security
        </button>

        <button
          onClick={() => setActiveTab("network")}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-all ${
            activeTab === "network"
              ? "bg-white/10 text-white shadow-sm"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          } flex-1 md:flex-none`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10.5 10.5 0 0114.14 0M1.758 9.172a15 15 0 0120.484 0" />
          </svg>
          Network
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-all ${
            activeTab === "system"
              ? "bg-white/10 text-white shadow-sm"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          } flex-1 md:flex-none`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          System Specs
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {activeTab === "personalization" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-white/95">Wallpaper</h2>
              <p className="text-[11px] text-zinc-400">Personalize your desktop background environment.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {wallpapers.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => setWallpaper(wp.id)}
                  className={`group relative flex h-20 flex-col items-center justify-end rounded-xl border p-2 text-left transition-all ${
                    wallpaper === wp.id
                      ? "border-emerald-500 bg-white/[0.05] ring-2 ring-emerald-500/20"
                      : "border-zinc-800 bg-black/40 hover:border-zinc-700 hover:bg-black/60"
                  }`}
                >
                  <div className={`absolute inset-1 rounded-lg ${wp.preview} opacity-80 transition-opacity group-hover:opacity-100`} />
                  <span className="relative z-10 w-full truncate text-[10px] font-medium text-white/90 drop-shadow">
                    {wp.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Wallpaper URL */}
            <div className="os-surface space-y-2 rounded-xl p-3">
              <label htmlFor="custom-wallpaper" className="text-[11px] font-medium text-zinc-300">Custom Wallpaper Image URL</label>
              <div className="flex gap-2">
                <input
                  id="custom-wallpaper"
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={customWallpaperUrl}
                  onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-800 bg-black/50 px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
                />
                <button
                  onClick={handleSaveCustomWallpaper}
                  className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30 transition-all hover:bg-emerald-500/35 hover:text-white"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Widgets Toggles */}
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-semibold tracking-tight text-white/95">Desktop Widgets</h3>
                <p className="text-[11px] text-zinc-400">Toggle floating components directly on your desktop layout.</p>
              </div>

              <div className="os-surface divide-y divide-zinc-800/50 rounded-xl">
                <div className="flex items-center justify-between p-3">
                  <div className="space-y-0.5">
                    <label htmlFor="widget-clock" className="text-xs font-medium text-zinc-200">Analog/Digital Clock</label>
                    <p className="text-[10px] text-zinc-500">Floating glass clock card on the right dashboard.</p>
                  </div>
                  <button
                    id="widget-clock"
                    onClick={() => handleWidgetToggle("clock")}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      widgets.includes("clock") ? "bg-emerald-500" : "bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        widgets.includes("clock") ? "translate-x-4.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3">
                  <div className="space-y-0.5">
                    <label htmlFor="widget-monitor" className="text-xs font-medium text-zinc-200">System Activity Graph</label>
                    <p className="text-[10px] text-zinc-500">Displays CPU and RAM usage paths in real time.</p>
                  </div>
                  <button
                    id="widget-monitor"
                    onClick={() => handleWidgetToggle("sys-monitor")}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      widgets.includes("sys-monitor") ? "bg-emerald-500" : "bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        widgets.includes("sys-monitor") ? "translate-x-4.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3">
                  <div className="space-y-0.5">
                    <label htmlFor="widget-notes" className="text-xs font-medium text-zinc-200">Sticky Note pad</label>
                    <p className="text-[10px] text-zinc-500">Quick text notes saved and synced to localStorage.</p>
                  </div>
                  <button
                    id="widget-notes"
                    onClick={() => handleWidgetToggle("notes")}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      widgets.includes("notes") ? "bg-emerald-500" : "bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        widgets.includes("notes") ? "translate-x-4.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3">
                  <div className="space-y-0.5">
                    <label htmlFor="toggle-icons" className="text-xs font-medium text-zinc-200">Desktop Shortcuts</label>
                    <p className="text-[10px] text-zinc-500">Show or hide app shortcut icons on the desktop.</p>
                  </div>
                  <button
                    id="toggle-icons"
                    onClick={() => setDesktopIconsVisible(!desktopIconsVisible)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      desktopIconsVisible ? "bg-emerald-500" : "bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        desktopIconsVisible ? "translate-x-4.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-white/95">Security & Lock</h2>
              <p className="text-[11px] text-zinc-400">Configure desktop login passcode constraints.</p>
            </div>

            <div className="os-surface space-y-4 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-zinc-200">Passcode PIN Security</h3>
                  <p className="text-[10px] text-zinc-500">Requires a numeric passcode lock when waking up.</p>
                </div>
                <div className="text-xs font-medium text-zinc-400">
                  Status: {passcode ? (
                    <span className="font-semibold text-emerald-400">ENABLED</span>
                  ) : (
                    <span className="text-zinc-500">DISABLED</span>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label htmlFor="pin-input" className="text-[11px] font-medium text-zinc-400">Enter a 4-Digit Numeric PIN</label>
                  <div className="flex gap-2">
                    <input
                      id="pin-input"
                      type="password"
                      maxLength={4}
                      placeholder="e.g. 1234"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                      className="w-32 rounded-lg border border-zinc-800 bg-black/50 px-3 py-1.5 text-center text-xs tracking-widest text-white focus:border-zinc-600 focus:outline-none"
                    />
                    <button
                      onClick={handleSavePin}
                      disabled={pinInput.length !== 4}
                      className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30 transition-all hover:bg-emerald-500/35 disabled:opacity-40"
                    >
                      Save PIN
                    </button>
                    {passcode && (
                      <button
                        onClick={handleRemovePin}
                        className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 border border-red-500/20 transition-all hover:bg-red-500/20"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {securityMessage && (
                  <p className={`text-[11px] ${securityMessage.startsWith("Error") ? "text-red-400" : "text-emerald-400"}`}>
                    {securityMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "network" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-white/95">Network Settings</h2>
              <p className="text-[11px] text-zinc-400">Simulate local network configurations & latencies.</p>
            </div>

            <div className="os-surface space-y-4 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="wifi-online" className="text-xs font-semibold text-zinc-200">Wi-Fi Connection</label>
                  <p className="text-[10px] text-zinc-500">Connect or disconnect from Megavault simulation nodes.</p>
                </div>
                <button
                  id="wifi-online"
                  onClick={() => setWifiOnline(!isWifiOnline)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    isWifiOnline ? "bg-emerald-500" : "bg-zinc-800"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      isWifiOnline ? "translate-x-4.5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {isWifiOnline && (
                <div className="space-y-3 border-t border-zinc-800/50 pt-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-zinc-500">NETWORK NODE</div>
                      <div className="text-xs font-semibold text-zinc-200">megavault-node-ap-south</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-zinc-500">MOCK PING</div>
                      <div className="text-xs font-semibold text-emerald-400">12 ms</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-zinc-500">SIGNAL STRENGTH</div>
                      <div className="text-xs font-semibold text-zinc-200">Excellent (98%)</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-zinc-500">IP ADDRESS</div>
                      <div className="text-xs font-mono text-zinc-300">172.24.110.82</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-white/95">System Information</h2>
              <p className="text-[11px] text-zinc-400">Hardware and virtual cloud storage capacities.</p>
            </div>

            {/* Hardware specifications */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="os-surface rounded-xl p-3 space-y-1">
                <div className="text-[10px] text-zinc-500">PROCESSOR</div>
                <div className="text-xs font-semibold">Megavault Neural Core x8 (Virtual)</div>
                <div className="text-[10px] text-zinc-400">Allocated hyperthread instances</div>
              </div>

              <div className="os-surface rounded-xl p-3 space-y-1">
                <div className="text-[10px] text-zinc-500">SYSTEM MEMORY</div>
                <div className="text-xs font-semibold">16.0 GB Virtual RAM</div>
                <div className="text-[10px] text-zinc-400">ECC LPDDR5 simulated cache</div>
              </div>
            </div>

            {/* Storage Meter */}
            <div className="os-surface space-y-4 rounded-xl p-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-300">Megavault S3 Storage allocation</span>
                  <span className="text-zinc-400">8.2 GB / 100 GB</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800/80 overflow-hidden">
                  <div className="h-full w-[8.2%] rounded-full bg-gradient-to-r from-emerald-500 to-sky-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-300">Active AI Cache partition</span>
                  <span className="text-zinc-400">128 MB / 2.0 GB</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800/80 overflow-hidden">
                  <div className="h-full w-[6.4%] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400" />
                </div>
              </div>
            </div>

            {/* General OS Specs */}
            <div className="os-surface rounded-xl p-3">
              <table className="w-full text-[11px] text-zinc-400">
                <tbody>
                  <tr className="border-b border-zinc-800/40">
                    <td className="py-1.5 font-medium text-zinc-500">OS Edition</td>
                    <td className="py-1.5 text-right font-semibold text-zinc-200">Megavault OS Enterprise</td>
                  </tr>
                  <tr className="border-b border-zinc-800/40">
                    <td className="py-1.5 font-medium text-zinc-500">System Build</td>
                    <td className="py-1.5 text-right font-mono text-zinc-300">v24.110.82-stable</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-medium text-zinc-500">Kernel Version</td>
                    <td className="py-1.5 text-right font-mono text-zinc-300">5.15.0-antigravity</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
