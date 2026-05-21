"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatTime(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function DesktopLoginScreen({
  imageSrc = "/loc.png",
  onUnlock,
  passcode,
}: {
  imageSrc?: string;
  onUnlock: () => void;
  passcode?: string | null;
}) {
  const [now, setNow] = useState(() => new Date());
  const [phase, setPhase] = useState<"typing" | "done">("typing");
  const [typed, setTyped] = useState(0);
  const [pin, setPin] = useState("");
  const [errorShake, setErrorShake] = useState(false);
  const hasUnlockedRef = useRef(false);

  const passwordMask = useMemo(() => "••••••••", []);
  const displayName = "R43AP3R editz";
  const avatarSrc = "/Photo.png";

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 10_000);
    return () => window.clearInterval(t);
  }, []);

  // Autofill login logic (only if no passcode is set)
  useEffect(() => {
    if (passcode) return; // skip if passcode is active

    if (typed >= passwordMask.length) {
      setPhase("done");
      return;
    }
    const t = window.setTimeout(() => setTyped((n) => n + 1), 110);
    return () => window.clearTimeout(t);
  }, [phase, passwordMask.length, typed, passcode]);

  useEffect(() => {
    if (passcode) return; // skip if passcode is active
    if (phase !== "done") return;
    if (hasUnlockedRef.current) return;
    hasUnlockedRef.current = true;
    const t = window.setTimeout(() => onUnlock(), 260);
    return () => window.clearTimeout(t);
  }, [onUnlock, phase, passcode]);

  // Passcode entry logic
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
        // Incorrect PIN
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

  const handleClear = () => {
    setPin("");
  };

  // Keyboard support for passcode
  useEffect(() => {
    if (!passcode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleKeypadPress(e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Escape" || e.key === "Delete") {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, passcode]);

  return (
    <div className="absolute inset-0 z-50 grid place-items-center overflow-hidden bg-black text-white">
      <img
        src={imageSrc}
        alt="Login screen"
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />

      {/* Shake animation custom CSS */}
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

      <div className={`relative w-[min(480px,92vw)] rounded-[28px] border border-white/12 bg-black/35 p-7 shadow-[0_30px_140px_rgba(0,0,0,0.65)] backdrop-blur transition-all duration-300 ${
        errorShake ? "animate-shake border-red-500/50 bg-red-950/10 shadow-[0_0_40px_rgba(239,68,68,0.1)]" : ""
      }`}>
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-[46px] font-semibold tracking-tight leading-none">
              {formatTime(now)}
            </div>
            <div className="mt-1 text-[13px] text-white/65">
              {passcode ? "Passcode Lock" : "Login"}
            </div>
          </div>
          <div className="text-right text-[12px] text-white/55">Secure session</div>
        </div>

        <div className="mt-7 flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/5">
            <img
              src={avatarSrc}
              alt={`${displayName} avatar`}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
          <div className="min-w-0">
            <div className="truncate text-[16px] font-semibold tracking-tight text-white/90">
              {displayName}
            </div>
            <div className="mt-0.5 text-[12px] text-white/55">
              {passcode ? "PIN Verification Required" : "Password autofill"}
            </div>
          </div>
        </div>

        {passcode ? (
          /* PIN KEYPAD VIEW */
          <div className="mt-6 flex flex-col items-center gap-5">
            {/* PIN Dots indicators */}
            <div className="flex justify-center gap-4 py-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-full border border-white/30 transition-all duration-150 ${
                    i < pin.length
                      ? errorShake
                        ? "bg-red-500 border-red-400 shadow-[0_0_8px_#ef4444]"
                        : "bg-emerald-400 border-emerald-300 shadow-[0_0_8px_#34d399]"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>

            {/* Layout Keypad */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-3 pt-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] text-sm font-semibold transition-all hover:bg-white/10 active:scale-90"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="flex h-12 w-12 items-center justify-center rounded-full text-[10px] font-medium text-zinc-500 transition-all hover:text-zinc-300 active:scale-90"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress("0")}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] text-sm font-semibold transition-all hover:bg-white/10 active:scale-90"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="flex h-12 w-12 items-center justify-center rounded-full text-zinc-500 transition-all hover:text-zinc-300 active:scale-90"
                aria-label="Backspace"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414A2 2 0 0010.828 19h7.344a2 2 0 002-2V7a2 2 0 00-2-2h-7.344a2 2 0 00-1.414.586L3 12z" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* DEFAULT AUTO-FILL PASSWORD VIEW */
          <div className="mt-6">
            <div className="rounded-2xl border border-white/12 bg-black/45 px-4 py-3">
              <div className="text-[12px] text-white/65">Password</div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="font-mono text-[14px] tracking-[0.22em] text-white/90">
                  {passwordMask.slice(0, typed)}
                  <span className="text-white/25">{passwordMask.slice(typed)}</span>
                </div>
                <div className="text-[12px] text-white/55">
                  {phase === "typing" ? "typing…" : "unlocked"}
                </div>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-white/45" />
          </div>
        )}
      </div>
    </div>
  );
}
