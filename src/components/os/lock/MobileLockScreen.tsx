"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isTorchBusy, setIsTorchBusy] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
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

  const openCamera = async () => {
    setIsCameraOpen(true);
    const stream = await ensureCamera();
    if (!stream) setIsCameraOpen(false);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    if (isTorchOn) {
      void (async () => {
        try {
          const s = streamRef.current;
          const track = s?.getVideoTracks?.()[0];
          await track?.applyConstraints?.({ advanced: [{ torch: false }] } as any);
        } catch {
          // ignore
        } finally {
          setIsTorchOn(false);
          stopStream();
        }
      })();
      return;
    }
    stopStream();
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

        <div className="absolute bottom-7 left-0 right-0 px-6">
          <div className="flex items-end justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void toggleTorch();
              }}
              disabled={isTorchBusy}
              className="rounded-2xl border border-white/12 bg-black/35 px-3 py-2 text-[12px] text-white/80 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur disabled:opacity-50"
              aria-label={isTorchOn ? "Turn torch off" : "Turn torch on"}
            >
              {isTorchOn ? "Torch On" : "Torch"}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void openCamera();
              }}
              className="rounded-2xl border border-white/12 bg-black/35 px-3 py-2 text-[12px] text-white/80 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur"
              aria-label="Open camera"
            >
              Camera
            </button>
          </div>

          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="h-1 w-16 rounded-full bg-white/25" />
            <div className="text-[12px] font-medium text-white/70">{hint}</div>
          </div>
        </div>
      </div>

      {toast ? (
        <div className="pointer-events-none absolute left-1/2 top-6 z-[60] -translate-x-1/2 rounded-2xl border border-white/10 bg-black/55 px-4 py-2 text-[12px] text-white/80 backdrop-blur">
          {toast}
        </div>
      ) : null}

      {isCameraOpen ? (
        <div className="absolute inset-0 z-[70] bg-black">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            playsInline
            muted
          />
          <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-5 pt-6">
            <div className="text-[13px] font-semibold text-white/85">Camera</div>
            <button
              type="button"
              onClick={closeCamera}
              className="rounded-2xl border border-white/12 bg-black/40 px-3 py-2 text-[12px] text-white/80 backdrop-blur"
              aria-label="Close camera"
            >
              Close
            </button>
          </div>
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border-2 border-white/75" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

