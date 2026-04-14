"use client";

import { useEffect, useRef, useState } from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function Wallpaper({ src }: { src: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    // Best-effort autoplay. If it fails, we still keep the UI usable.
    void video.play().catch(() => {});
  }, [prefersReducedMotion]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <video
        ref={videoRef}
        // Full-screen `filter: blur()` is GPU-expensive. Keep it subtle for smoother FPS.
        className="h-full w-full scale-[1.02] object-cover blur-[4px]"
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={src} />
      </video>

      {/* AMOLED-friendly readability overlay */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.08),transparent_50%)]" />
      <div className="absolute inset-0 os-bg-gradient opacity-60" />
    </div>
  );
}

