"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  passcode,
}: {
  imageSrc?: string;
  onUnlock: () => void;
  passcode?: string | null;
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

  // Mobile passcode entry states
  const [showPinView, setShowPinView] = useState(false);
  const [pin, setPin] = useState("");
  const [errorShake, setErrorShake] = useState(false);

  const hint = useMemo(() => passcode ? "Swipe up to enter PIN" : "Swipe up to open", [passcode]);

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 10_000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  // Auto-swipe up and unlock if no passcode is set (delightful automatic greeting)
  useEffect(() => {
    if (passcode) return; // skip if passcode is active
    
    const tStart = window.setTimeout(() => {
      setIsDragging(true);
      let currentDrag = 0;
      const interval = window.setInterval(() => {
        currentDrag += 16;
        setDragY(currentDrag);
        if (currentDrag >= 160) {
          window.clearInterval(interval);
          setIsDragging(false);
          onUnlock();
        }
      }, 16);
    }, 1000);

    return () => window.clearTimeout(tStart);
  }, [passcode, onUnlock]);

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
      if (passcode) {
        setShowPinView(true);
      } else {
        onUnlock();
      }
      return;
    }
    setDragY(0);
  };

  const handleKeypadPress = (num: string) => {
    if (pin.length >= 4) return;
    const nextPin = pin + num;
    setPin(nextPin);

    if (nextPin.length === 4) {
      if (nextPin === passcode) {
        setTimeout(() => {
          onUnlock();
        }, 300);
      } else {
        setTimeout(() => {
          setErrorShake(true);
          setTimeout(() => {
            setErrorShake(false);
            setPin("");
          }, 500);
        }, 200);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
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

      {/* Shake keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>

      {/* PIN Keypad Screen Overlay */}
      {showPinView ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-5 w-[min(360px,90vw)]">
            <div className="text-sm font-semibold tracking-tight text-white/80">Enter Passcode</div>
            
            {/* PIN Dots */}
            <div className="flex justify-center gap-5 py-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-full border border-white/40 transition-all duration-150 ${
                    i < pin.length
                      ? errorShake
                        ? "bg-red-500 border-red-400 shadow-[0_0_8px_#ef4444]"
                        : "bg-emerald-400 border-emerald-300 shadow-[0_0_8px_#34d399]"
                      : "bg-white/10"
                  } ${errorShake ? "animate-shake" : ""}`}
                />
              ))}
            </div>

            {/* Grid numbers */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-4 pt-4">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] text-lg font-semibold transition-all hover:bg-white/10 active:scale-90"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setShowPinView(false);
                  setPin("");
                }}
                className="flex h-16 w-16 items-center justify-center rounded-full text-xs font-semibold text-zinc-400 transition-all hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress("0")}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] text-lg font-semibold transition-all hover:bg-white/10 active:scale-90"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="flex h-16 w-16 items-center justify-center rounded-full text-zinc-400 transition-all hover:text-zinc-200"
                aria-label="Backspace"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414A2 2 0 0010.828 19h7.344a2 2 0 002-2V7a2 2 0 00-2-2h-7.344a2 2 0 00-1.414.586L3 12z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Regular Clock & Swipe-to-unlock Screen */
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
                <svg className="h-9 w-9 opacity-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M5 7h3l2-2h4l2 2h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 17a3 3 0 1 0 0-6a3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="mt-4 flex flex-col items-center gap-3">
              <div className="h-1 w-16 rounded-full bg-white/25" />
              <div className="text-[12px] font-medium text-white/70">{hint}</div>
            </div>
          </div>
        </div>
      )}

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={() => {
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
