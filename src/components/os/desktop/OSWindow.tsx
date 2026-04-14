"use client";

import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";

import type { AppId } from "@/os/apps";
import type { WindowRect } from "@/components/os/state/DesktopOSContext";
import type { WindowState } from "@/components/os/state/DesktopOSContext";

type Props = {
  appId: AppId;
  title: string;
  focused: boolean;
  rect: WindowRect;
  maximized: boolean;
  phase: WindowState["phase"];
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onRectChange: (rect: WindowRect) => void;
  children: ReactNode;
};

type DragMode = "move" | "resize-se";

export function OSWindow({
  title,
  focused,
  rect,
  maximized,
  phase,
  zIndex,
  onClose,
  onFocus,
  onMinimize,
  onToggleMaximize,
  onRectChange,
  children,
}: Props) {
  const [dragMode, setDragMode] = useState<DragMode | null>(null);
  const startRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    rect: WindowRect;
  } | null>(null);

  const style = useMemo(() => {
    if (maximized) {
      return {
        left: 10,
        right: 10,
        top: "calc(var(--os-menubar-h) + 10px)",
        bottom: "calc(var(--os-dock-h) + 10px)",
        width: "auto",
        height: "auto",
      } as const;
    }
    return { left: rect.x, top: rect.y, width: rect.w, height: rect.h } as const;
  }, [maximized, rect]);

  const stopTitlebarDrag = (e: React.PointerEvent) => {
    e.stopPropagation();
    // Prevent the titlebar from capturing the pointer for drag.
    // (Without this, macOS buttons can feel “dead”.)
    e.preventDefault();
  };

  return (
    <div
      className={[
        "absolute rounded-2xl border os-surface",
        focused ? "os-border-strong shadow-[var(--os-shadow)]" : "shadow-[var(--os-shadow-soft)]",
        // Avoid animating layout props (left/top/width/height) to keep motion smooth.
        "overflow-hidden will-change-transform",
        dragMode ? "" : "transition-[box-shadow,left,top,width,height,opacity,transform] duration-260 ease-[cubic-bezier(0.2,0.9,0.2,1)]",
      ].join(" ")}
      style={{
        ...style,
        zIndex,
        animation:
          phase === "closing"
            ? "osWindowOut 240ms cubic-bezier(0.2,0.9,0.2,1) forwards"
            : phase === "minimizing"
              ? "osWindowMinimize 240ms cubic-bezier(0.2,0.9,0.2,1) forwards"
              : phase === "maximizing"
                ? "osWindowMaximizePulse 260ms cubic-bezier(0.2,0.9,0.2,1)"
                : "osWindowIn 220ms cubic-bezier(0.2,0.9,0.2,1)",
      }}
      onPointerDown={() => onFocus()}
      role="dialog"
      aria-label={title}
    >
      <div
        className={[
          "flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2",
          "select-none",
        ].join(" ")}
        onPointerDown={(e) => {
          if (maximized) return;
          onFocus();
          setDragMode("move");
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          startRef.current = {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            rect,
          };
        }}
        onPointerMove={(e) => {
          const start = startRef.current;
          if (!start || dragMode !== "move" || maximized) return;
          const dx = e.clientX - start.startX;
          const dy = e.clientY - start.startY;
          onRectChange({ ...start.rect, x: start.rect.x + dx, y: start.rect.y + dy });
        }}
        onPointerUp={(e) => {
          const start = startRef.current;
          if (!start || start.pointerId !== e.pointerId) return;
          setDragMode(null);
          startRef.current = null;
          try {
            (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
          } catch {}
        }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onPointerDown={stopTitlebarDrag}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-black/30 transition-transform active:scale-95"
            aria-label="Close"
          />
          <button
            type="button"
            onPointerDown={stopTitlebarDrag}
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-black/30 transition-transform active:scale-95"
            aria-label="Minimize"
          />
          <button
            type="button"
            onPointerDown={stopTitlebarDrag}
            onClick={(e) => {
              e.stopPropagation();
              onToggleMaximize();
            }}
            className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-black/30 transition-transform active:scale-95"
            aria-label={maximized ? "Restore" : "Maximize"}
          />
        </div>

        <div className="min-w-0 flex-1 text-center text-[11px] font-medium tracking-tight text-white/85">
          <span className="truncate">{title}</span>
        </div>

        <div className="w-[54px]" />
      </div>

      <div className="relative h-[calc(100%-40px)] overflow-auto">
        {children}

        {!maximized ? (
          <div
            className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize"
            onPointerDown={(e) => {
              onFocus();
              setDragMode("resize-se");
              (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
              startRef.current = {
                pointerId: e.pointerId,
                startX: e.clientX,
                startY: e.clientY,
                rect,
              };
            }}
            onPointerMove={(e) => {
              const start = startRef.current;
              if (!start || dragMode !== "resize-se" || maximized) return;
              const dx = e.clientX - start.startX;
              const dy = e.clientY - start.startY;
              onRectChange({
                ...start.rect,
                w: start.rect.w + dx,
                h: start.rect.h + dy,
              });
            }}
            onPointerUp={(e) => {
              const start = startRef.current;
              if (!start || start.pointerId !== e.pointerId) return;
              setDragMode(null);
              startRef.current = null;
              try {
                (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
              } catch {}
            }}
            aria-hidden
          >
            <div className="absolute bottom-1 right-1 h-3 w-3 rounded-sm border border-white/10 bg-white/10" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

