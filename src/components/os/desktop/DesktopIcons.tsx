"use client";

import { useState, useEffect } from "react";
import { useDesktopOS } from "@/components/os/state/DesktopOSContext";
import { type AppId } from "@/os/apps";

type Shortcut = {
  id: string;
  name: string;
  appId: AppId;
  type: "folder" | "file" | "app";
  iconColor: string;
};

export function DesktopIcons() {
  const { openApp, desktopIconsVisible } = useDesktopOS();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const shortcuts: Shortcut[] = [
    { id: "projects", name: "Projects", appId: "projects", type: "folder", iconColor: "text-amber-400" },
    { id: "about", name: "About Me", appId: "about", type: "folder", iconColor: "text-amber-400" },
    { id: "music", name: "Music App", appId: "music", type: "app", iconColor: "text-cyan-400" },
    { id: "terminal", name: "Terminal", appId: "terminal", type: "app", iconColor: "text-sky-400" },
    { id: "settings", name: "System Settings", appId: "settings", type: "app", iconColor: "text-zinc-400" },
    { id: "readme", name: "README.txt", appId: "readme", type: "file", iconColor: "text-emerald-400" },
  ];

  // Deselect on clicking empty desktop area
  useEffect(() => {
    const handleDeselect = (e: MouseEvent) => {
      // If we clicked on an element that is not a desktop icon button, deselect
      const target = e.target as HTMLElement;
      if (!target.closest(".desktop-icon-btn")) {
        setSelectedId(null);
      }
    };
    window.addEventListener("click", handleDeselect);
    return () => window.removeEventListener("click", handleDeselect);
  }, []);

  if (!desktopIconsVisible) return null;

  const renderIcon = (type: "folder" | "file" | "app", colorClass: string) => {
    if (type === "folder") {
      return (
        <svg className={`h-11 w-11 ${colorClass}`} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 7a2 2 0 0 1 2-2h3.172a2 2 0 0 1 1.414.586l1.828 1.828A2 2 0 0 0 12.828 8H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
        </svg>
      );
    }
    if (type === "file") {
      return (
        <svg className={`h-11 w-11 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    }
    // App configuration icon
    return (
      <svg className={`h-11 w-11 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  };

  return (
    <div className="pointer-events-none absolute bottom-24 left-6 top-[calc(var(--os-menubar-h)+24px)] z-0 flex w-36 select-none flex-col gap-5 py-4">
      {shortcuts.map((sc) => {
        const isSelected = selectedId === sc.id;

        return (
          <button
            key={sc.id}
            type="button"
            className={`desktop-icon-btn pointer-events-auto group flex w-24 flex-col items-center gap-1.5 rounded-xl border p-2 transition-all active:scale-95 ${
              isSelected
                ? "border-emerald-500/40 bg-white/[0.08] shadow-[0_0_12px_rgba(16,185,129,0.15)] backdrop-blur-md"
                : "border-transparent bg-transparent hover:bg-white/[0.02]"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedId(sc.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              openApp(sc.appId);
              setSelectedId(null);
            }}
            aria-label={`Open ${sc.name}`}
          >
            <div className="transition-transform duration-200 group-hover:scale-105">
              {renderIcon(sc.type, sc.iconColor)}
            </div>
            <span className="text-center text-[10px] font-semibold tracking-tight text-white/90 drop-shadow-md">
              {sc.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
