"use client";

import type { ReactNode } from "react";

export function OSAppIcon({
  src,
  alt,
  tintClassName,
  children,
}: {
  src?: string;
  alt?: string;
  tintClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={[
        "grid h-14 w-14 place-items-center rounded-[18px]",
        // Lighter tile so icons read better on dark wallpapers.
        "bg-[rgba(255,255,255,0.10)]",
        "border border-white/16",
        "shadow-[0_18px_60px_rgba(0,0,0,0.50)]",
        "ring-1 ring-white/10",
      ].join(" ")}
      aria-hidden
    >
      {children ? (
        <div className={["h-7 w-7 text-white", tintClassName ?? ""].join(" ")}>
          {children}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={["h-7 w-7", "invert brightness-0 saturate-0", tintClassName ?? ""].join(" ")}
          draggable={false}
        />
      )}
    </div>
  );
}


