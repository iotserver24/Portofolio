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

    // If `src` changes (desktop vs mobile), force reload.
    video.load();

    // Best-effort autoplay. If it fails, we still keep the UI usable.
    void video.play().catch(() => {});
  }, [prefersReducedMotion, src]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <video
        ref={videoRef}
        // Very light bg blur (~5% strength); full-screen filter is GPU-expensive.
        className="h-full w-full scale-[1.02] object-cover blur-[1px]"
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

