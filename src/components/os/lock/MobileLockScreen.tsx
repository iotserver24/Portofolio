"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** Inline SVGs so icons always render (no broken /os-icons loads) and use currentColor for dark UI. */
function IconTorchOff({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M9 2h6l1 3v6l-2 2v5a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-5l-2-2V5l1-3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 7h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 13h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconTorchOn({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M9 2h6l1 3v6l-2 2v5a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-5l-2-2V5l1-3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 7h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 13h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 12l-2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 12l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconCamera({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5 7h3l2-2h4l2 2h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17a3 3 0 1 0 0-6a3 3 0 0 0 0 6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatTime(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function MobileLockScreen({
  imageSrc = "/mb_loc.png",
  onUnlock,
}: {
  imageSrc?: string;
  onUnlock: () => void;
}) {
  const [now, setNow] = useState(() => new Date());
  const startYRef = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [entered, setEntered] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isTorchBusy, setIsTorchBusy] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const hint = useMemo(() => "Swipe up to open", []);

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 10_000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const stopStream = () => {
    const s = streamRef.current;
    if (!s) return;
    s.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    return () => stopStream();
  }, []);

  const ensureCamera = async (): Promise<MediaStream | null> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setToast("Camera not supported");
      return null;
    }
    if (streamRef.current) return streamRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      return stream;
    } catch {
      setToast("Camera permission denied");
      return null;
    }
  };

  const toggleTorch = async () => {
    setIsTorchBusy(true);
    try {
      const stream = await ensureCamera();
      if (!stream) return;
      const track = stream.getVideoTracks()[0];
      if (!track) return;

      const caps: any = track.getCapabilities?.() ?? {};
      if (!caps.torch) {
        setToast("Torch not supported");
        return;
      }

      const next = !isTorchOn;
      await track.applyConstraints({ advanced: [{ torch: next }] } as any);
      setIsTorchOn(next);
    } catch {
      setToast("Torch failed");
    } finally {
      setIsTorchBusy(false);
    }
  };

  const openNativeCamera = () => {
    const el = cameraInputRef.current;
    if (!el) return;
    el.value = "";
    el.click();
  };

  const endDrag = (unlock: boolean) => {
    startYRef.current = null;
    setIsDragging(false);
    if (unlock) {
      onUnlock();
      return;
    }
    setDragY(0);
  };

  return (
    <div className="absolute inset-0 z-50 overflow-hidden bg-black text-white">
      <img
        src={imageSrc}
        alt="Lock screen"
        className="absolute inset-0 h-full w-full object-cover opacity-95"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/70" />

      <div
        className="relative h-full w-full touch-none"
        style={{
          transform: `translateY(${entered ? -dragY : 0}px)`,
          transition: isDragging ? undefined : "transform 220ms cubic-bezier(0.2,0.9,0.2,1)",
          touchAction: "none",
        }}
        ref={(node) => {
          if (!node) return;
          if (entered) return;
          requestAnimationFrame(() => setEntered(true));
        }}
        onPointerDown={(e) => {
          if (!e.isPrimary) return;
          startYRef.current = e.clientY;
          setDragY(0);
          setIsDragging(true);
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const startY = startYRef.current;
          if (startY == null) return;
          const dy = startY - e.clientY; // swipe up => positive
          setDragY(Math.max(0, Math.min(320, dy)));
        }}
        onPointerUp={() => endDrag(dragY > 140)}
        onPointerCancel={() => endDrag(false)}
      >
        <div className="px-6 pt-16">
          <div className="text-[58px] font-semibold tracking-tight leading-none">
            {formatTime(now)}
          </div>
          <div className="mt-2 text-[13px] text-white/70">Swipe up</div>
        </div>

        <div className="pointer-events-auto absolute bottom-5 left-0 right-0 z-10 px-6 touch-manipulation">
          <div className="flex items-end justify-between">
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                void toggleTorch();
              }}
              disabled={isTorchBusy}
              className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-white/14 bg-black/35 text-white shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur disabled:opacity-50"
              aria-label={isTorchOn ? "Turn torch off" : "Turn torch on"}
            >
              {isTorchOn ? (
                <IconTorchOn className="h-9 w-9 opacity-100" />
              ) : (
                <IconTorchOff className="h-9 w-9 opacity-90" />
              )}
            </button>

            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                openNativeCamera();
              }}
              className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-white/14 bg-black/35 text-white shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur"
              aria-label="Open camera"
            >
              <IconCamera className="h-9 w-9 opacity-90" />
            </button>
          </div>

          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="h-1 w-16 rounded-full bg-white/25" />
            <div className="text-[12px] font-medium text-white/70">{hint}</div>
          </div>
        </div>
      </div>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={() => {
          // We don't need the file; we just want the native camera UI.
          setToast("Captured");
        }}
      />

      {toast ? (
        <div className="pointer-events-none absolute left-1/2 top-6 z-[60] -translate-x-1/2 rounded-2xl border border-white/10 bg-black/55 px-4 py-2 text-[12px] text-white/80 backdrop-blur">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

