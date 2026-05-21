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

  const isVideo = src.endsWith(".mp4") || src.endsWith(".webm") || src.includes("_bg");

  useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;
    if (!video) return;

    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    video.load();
    void video.play().catch(() => {});
  }, [prefersReducedMotion, src, isVideo]);

  if (isVideo) {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-black">
        <video
          ref={videoRef}
          className="h-full w-full scale-[1.02] object-cover blur-[1px] opacity-90"
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

  // Self-contained keyframes for background animations
  const keyframesStyle = (
    <style>{`
      @keyframes wallpaperGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-wallpaper-gradient {
        background-size: 400% 400%;
        animation: wallpaperGradient 24s ease infinite;
      }
    `}</style>
  );

  if (src === "gradient-aurora") {
    return (
      <div
        aria-hidden
        className="animate-wallpaper-gradient absolute inset-0 z-0 bg-gradient-to-br from-[#0c1f1a] via-[#090b14] to-[#1a1130]"
      >
        {keyframesStyle}
      </div>
    );
  }

  if (src === "gradient-sunset") {
    return (
      <div
        aria-hidden
        className="animate-wallpaper-gradient absolute inset-0 z-0 bg-gradient-to-br from-[#291122] via-[#0b0c16] to-[#0f1d3a]"
      >
        {keyframesStyle}
      </div>
    );
  }

  if (src === "gradient-neon") {
    return (
      <div
        aria-hidden
        className="animate-wallpaper-gradient absolute inset-0 z-0 bg-gradient-to-br from-[#210931] via-[#030303] to-[#09212d]"
      >
        {keyframesStyle}
      </div>
    );
  }

  if (src === "carbon") {
    return (
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-[#0c0c0e]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 100% 150%, #0c0c0e 24%, #18181b 25%, #18181b 28%, #0c0c0e 29%, #0c0c0e 36%, #18181b 36%, #18181b 40%, transparent 40%, transparent),
            radial-gradient(circle at 0% 150%, #0c0c0e 24%, #18181b 25%, #18181b 28%, #0c0c0e 29%, #0c0c0e 36%, #18181b 36%, #18181b 40%, transparent 40%, transparent),
            radial-gradient(circle at 50% 100%, #18181b 10%, #0c0c0e 11%, #0c0c0e 23%, #18181b 24%, #18181b 30%, #0c0c0e 31%, #0c0c0e 43%, #18181b 44%, #18181b 50%, transparent 50%, transparent)
          `,
          backgroundSize: "20px 20px",
          opacity: 0.85,
        }}
      />
    );
  }

  // Default fallback or custom image URL
  return (
    <div
      aria-hidden
      className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${src})`,
        backgroundColor: "#030014",
      }}
    />
  );
}

