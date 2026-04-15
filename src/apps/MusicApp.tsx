import { useEffect, useMemo, useRef, useState } from "react";

import { musicTracks } from "@/apps/music/tracks";
import type { OSAppRenderContext } from "@/os/apps";

function isDirectAudioUrl(url: string) {
  const u = url.toLowerCase();
  return u.endsWith(".mp3") || u.endsWith(".wav") || u.endsWith(".ogg") || u.endsWith(".m4a");
}

function IconShuffle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M16 3h5v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 20l6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 4l6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14l2 2c1.3 1.3 3.1 2 4.9 2H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 10l2-2c1.3-1.3 3.1-2 4.9-2H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 16v5h-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPrev({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M6 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 6l-10 6l10 6V6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function IconNext({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M18 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 6l10 6L4 18V6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function IconPlay({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M9 7.5v9l8-4.5l-8-4.5z" />
    </svg>
  );
}

function IconPause({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M7.5 6.5h3v11h-3v-11zM13.5 6.5h3v11h-3v-11z" />
    </svg>
  );
}

function IconRepeat({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M17 2l4 4l-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 11V9a4 4 0 0 1 4-4h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 22l-4-4l4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 13v2a4 4 0 0 1-4 4H3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconQueue({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M4 6h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function shuffleArray<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type MusicAppProps = Partial<OSAppRenderContext>;

export function MusicApp(props: MusicAppProps = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(true);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("all");
  const [queue, setQueue] = useState<number[]>([]);
  const [queuePos, setQueuePos] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showQueue, setShowQueue] = useState(false);
  const onClose = props.onClose;

  const playableIndices = useMemo(() => {
    return musicTracks
      .map((t, idx) => ({ t, idx }))
      .filter(({ t }) => Boolean(t.audioUrl || (t.url && isDirectAudioUrl(t.url))))
      .map(({ idx }) => idx);
  }, []);

  // Build / rebuild queue when tracks/shuffle changes.
  useEffect(() => {
    const base = playableIndices;
    const nextQueue = shuffle ? shuffleArray(base) : base;
    setQueue(nextQueue);
    setQueuePos(0);
  }, [shuffle, playableIndices]);

  const selectedIndex = useMemo(() => {
    if (queue.length === 0) return -1;
    return queue[Math.min(queuePos, queue.length - 1)] ?? -1;
  }, [queue, queuePos]);

  const selected = useMemo(() => {
    if (selectedIndex < 0) return null;
    return musicTracks[selectedIndex] ?? null;
  }, [selectedIndex]);

  const selectedAudioUrl = useMemo(() => {
    if (!selected) return null;
    if (selected.audioUrl) return selected.audioUrl;
    if (selected.url && isDirectAudioUrl(selected.url)) return selected.url;
    return null;
  }, [selected]);

  // Keep audio element in sync with selected track.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (!selectedAudioUrl) {
      el.removeAttribute("src");
      el.load();
      setIsPlaying(false);
      setDuration(0);
      setCurrentTime(0);
      return;
    }
    el.src = selectedAudioUrl;
    el.load();
    setCurrentTime(0);
    if (isPlaying) {
      void el.play().catch(() => setIsPlaying(false));
    }
  }, [selectedAudioUrl]);

  // When user toggles play/pause.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (!selectedAudioUrl) return;
    if (isPlaying) {
      void el.play().catch(() => setIsPlaying(false));
    } else {
      el.pause();
    }
  }, [isPlaying, selectedAudioUrl]);

  const playFromIndex = (idx: number) => {
    if (!playableIndices.includes(idx)) return;
    // Rebuild queue starting with the clicked track.
    const rest = playableIndices.filter((i) => i !== idx);
    const next = shuffle ? [idx, ...shuffleArray(rest)] : [idx, ...rest];
    setQueue(next);
    setQueuePos(0);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (queue.length === 0) return;
    setQueuePos((p) => {
      const atEnd = p + 1 >= queue.length;
      if (atEnd) {
        if (repeatMode === "off") return p;
        return 0;
      }
      return p + 1;
    });
    setIsPlaying(repeatMode !== "off" || queuePos + 1 < queue.length);
  };

  const prevTrack = () => {
    const el = audioRef.current;
    // If we've listened a bit, restart track.
    if (el && el.currentTime > 3) {
      el.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    if (queue.length === 0) return;
    setQueuePos((p) => (p - 1 >= 0 ? p - 1 : Math.max(0, queue.length - 1)));
    setIsPlaying(true);
  };

  return (
    <div className="font-mono text-[13px] text-white">
      {/* Mobile player UI (matches your screenshot vibe) */}
      <div className="sm:hidden">
        <div className="relative h-full w-full overflow-hidden">
          {selected?.posterUrl ? (
            <div aria-hidden className="absolute inset-0">
              <div
                className="absolute inset-0 scale-[1.18]"
                style={{
                  backgroundImage: `url(${selected.posterUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(26px)",
                  opacity: 0.85,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/50 to-black/85" />
            </div>
          ) : (
            <div aria-hidden className="absolute inset-0 bg-white/5" />
          )}

          <div className="relative flex min-h-[560px] flex-col px-5 pb-5 pt-4">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {onClose ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-2xl border border-white/12 bg-black/30 px-3 py-2 text-[11px] font-semibold tracking-tight text-white/80 backdrop-blur hover:bg-black/38"
                    aria-label="Close music"
                  >
                    Close
                  </button>
                ) : (
                  <div className="text-[11px] font-semibold tracking-tight text-white/70">
                    Now Playing
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowQueue(true)}
                className="rounded-2xl border border-white/12 bg-black/30 px-3 py-2 text-[11px] text-white/75 backdrop-blur hover:bg-black/38"
                aria-label="Open Up Next"
              >
                Up Next
              </button>
            </div>

            {/* Cover */}
            <div className="mt-5 grid place-items-center">
              <div className="h-[min(62vw,320px)] w-[min(62vw,320px)] overflow-hidden rounded-[28px] border border-white/12 bg-white/5 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
                {selected?.posterUrl ? (
                  <img
                    src={selected.posterUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                ) : null}
              </div>
            </div>

            {/* Title / artist */}
            <div className="mt-5">
              <div className="truncate text-[18px] font-semibold tracking-tight text-white/92">
                {selected?.title ?? "No tracks yet"}
              </div>
              <div className="mt-1 truncate text-[13px] text-white/65">
                {selected?.artist ?? "Add tracks in src/apps/music/tracks.ts"}
              </div>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <input
                type="range"
                min={0}
                max={Math.max(1, duration)}
                value={Math.min(duration || 0, currentTime)}
                onChange={(e) => {
                  const el = audioRef.current;
                  if (!el) return;
                  const next = Number(e.target.value);
                  el.currentTime = next;
                  setCurrentTime(next);
                }}
                className="h-1.5 w-full accent-white/85"
                aria-label="Seek"
                disabled={!selectedAudioUrl}
              />
              <div className="mt-2 flex items-center justify-between text-[11px] tabular-nums text-white/55">
                <div>{formatTime(currentTime)}</div>
                <div>-{formatTime(Math.max(0, duration - currentTime))}</div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-auto pt-4">
              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() => setShuffle((s) => !s)}
                  className={[
                    "grid h-12 w-12 place-items-center rounded-2xl",
                    shuffle ? "text-white/95" : "text-white/55",
                  ].join(" ")}
                  aria-label="Toggle shuffle"
                >
                  <IconShuffle className="h-6 w-6" />
                </button>

                <button
                  type="button"
                  onClick={prevTrack}
                  className="grid h-12 w-12 place-items-center rounded-2xl text-white/90"
                  aria-label="Previous"
                >
                  <IconPrev className="h-7 w-7" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!selectedAudioUrl) return;
                    setIsPlaying((p) => !p);
                  }}
                  className="grid h-16 w-16 place-items-center rounded-full bg-white text-black shadow-[0_26px_90px_rgba(0,0,0,0.55)]"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <IconPause className="h-8 w-8" /> : <IconPlay className="h-9 w-9" />}
                </button>

                <button
                  type="button"
                  onClick={nextTrack}
                  className="grid h-12 w-12 place-items-center rounded-2xl text-white/90"
                  aria-label="Next"
                >
                  <IconNext className="h-7 w-7" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setRepeatMode((m) => (m === "off" ? "all" : m === "all" ? "one" : "off"))
                  }
                  className={[
                    "grid h-12 w-12 place-items-center rounded-2xl",
                    repeatMode === "off" ? "text-white/55" : "text-white/95",
                  ].join(" ")}
                  aria-label="Toggle repeat"
                >
                  <IconRepeat className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-white/60">
                <button
                  type="button"
                  onClick={() => setShowQueue(true)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-black/30 px-3 py-2 backdrop-blur hover:bg-black/38"
                  aria-label="Up Next"
                >
                  <IconQueue className="h-4 w-4" />
                  Up Next
                </button>
                <div className="tabular-nums">
                  {queue.length > 0 ? `${queuePos + 1} / ${queue.length}` : "—"}
                </div>
              </div>

              {!selectedAudioUrl ? (
                <p className="mt-3 text-[11px] text-white/55">
                  Add a direct audio link as <span className="text-white/80">audioUrl</span> to play in-app.
                </p>
              ) : null}
            </div>
          </div>

          {/* Up Next overlay */}
          {showQueue ? (
            <div className="absolute inset-0 z-10">
              <div
                aria-hidden
                className="absolute inset-0 bg-black/55 backdrop-blur"
                onClick={() => setShowQueue(false)}
              />
              <div className="absolute inset-x-0 bottom-0 rounded-t-[32px] border border-white/12 bg-[rgba(10,10,12,0.72)] p-5 shadow-[0_-30px_120px_rgba(0,0,0,0.70)] backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-[13px] font-semibold tracking-tight text-white/90">
                    Up Next
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowQueue(false)}
                    className="rounded-2xl border border-white/12 bg-white/5 px-3 py-2 text-[11px] text-white/75 hover:bg-white/8"
                  >
                    Close
                  </button>
                </div>

                <div className="max-h-[42vh] overflow-auto pr-1">
                  <div className="space-y-2">
                    {queue.map((idx, pos) => {
                      const t = musicTracks[idx];
                      if (!t) return null;
                      const active = pos === queuePos;
                      return (
                        <button
                          key={`${t.title}-${String(t.audioUrl ?? t.url ?? idx)}`}
                          type="button"
                          onClick={() => {
                            setQueuePos(pos);
                            setIsPlaying(true);
                            setShowQueue(false);
                          }}
                          className={[
                            "flex w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left",
                            active ? "border-white/18 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/8",
                          ].join(" ")}
                        >
                          <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                            {t.posterUrl ? (
                              <img src={t.posterUrl} alt="" className="h-full w-full object-cover" draggable={false} />
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[12px] font-semibold tracking-tight text-white/90">
                              {t.title}
                            </div>
                            <div className="truncate text-[11px] text-white/60">{t.artist ?? "—"}</div>
                          </div>
                          <div className="text-[11px] tabular-nums text-white/55">{pos + 1}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Desktop/tablet UI (window layout) */}
      <div className="hidden space-y-4 sm:block">
      <section className="os-surface relative overflow-hidden rounded-2xl">
        {selected?.posterUrl ? (
          <div aria-hidden className="absolute inset-0">
            <div
              className="absolute inset-0 scale-[1.08]"
              style={{
                backgroundImage: `url(${selected.posterUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(22px)",
                opacity: 0.75,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/45 to-black/70" />
            <div className="absolute inset-0 ring-1 ring-white/10" />
          </div>
        ) : (
          <div aria-hidden className="absolute inset-0 bg-white/5 ring-1 ring-white/10" />
        )}

        <div className="relative px-4 py-4">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {selected?.posterUrl ? (
                <img
                  src={selected.posterUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-zinc-100/65">$ now_playing</p>
              <p className="mt-1 truncate text-sm font-semibold tracking-tight text-white/90">
                {selected?.title ?? "No tracks yet"}
              </p>
              <p className="mt-0.5 truncate text-xs text-white/65">
                {selected?.artist ?? "Add tracks in src/apps/music/tracks.ts"}
              </p>

              <div className="mt-3 space-y-3">
                {/* Hidden audio element; UI is custom controls */}
                <audio
                  ref={audioRef}
                  preload="none"
                  onLoadedMetadata={() => {
                    const el = audioRef.current;
                    if (!el) return;
                    setDuration(el.duration || 0);
                  }}
                  onTimeUpdate={() => {
                    const el = audioRef.current;
                    if (!el) return;
                    setCurrentTime(el.currentTime || 0);
                  }}
                  onEnded={() => {
                    const el = audioRef.current;
                    if (!el) return;
                    if (repeatMode === "one") {
                      el.currentTime = 0;
                      void el.play().catch(() => setIsPlaying(false));
                      return;
                    }
                    const atEnd = queuePos + 1 >= queue.length;
                    if (atEnd && repeatMode === "off") {
                      setIsPlaying(false);
                      return;
                    }
                    nextTrack();
                  }}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={prevTrack}
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs text-white/85 ring-1 ring-white/15 hover:bg-white/14"
                    aria-label="Previous"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedAudioUrl) return;
                      setIsPlaying((p) => !p);
                    }}
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs text-white/90 ring-1 ring-white/15 hover:bg-white/14"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                  <button
                    type="button"
                    onClick={nextTrack}
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs text-white/85 ring-1 ring-white/15 hover:bg-white/14"
                    aria-label="Next"
                  >
                    Next
                  </button>

                  <button
                    type="button"
                    onClick={() => setShuffle((s) => !s)}
                    className={[
                      "ml-1 inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs ring-1 transition",
                      shuffle
                        ? "bg-cyan-400/15 text-cyan-100 ring-cyan-300/25 hover:bg-cyan-400/18"
                        : "bg-white/10 text-white/75 ring-white/15 hover:bg-white/14",
                    ].join(" ")}
                    aria-label="Toggle shuffle"
                  >
                    Shuffle
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setRepeatMode((m) => (m === "off" ? "all" : m === "all" ? "one" : "off"))
                    }
                    className={[
                      "inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs ring-1 transition",
                      repeatMode === "off"
                        ? "bg-white/10 text-white/75 ring-white/15 hover:bg-white/14"
                        : "bg-cyan-400/15 text-cyan-100 ring-cyan-300/25 hover:bg-cyan-400/18",
                    ].join(" ")}
                    aria-label="Toggle repeat"
                  >
                    Repeat
                  </button>

                  {selected?.url ? (
                    <a
                      className="ml-auto inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs text-emerald-200 ring-1 ring-white/15 hover:bg-white/14"
                      href={selected.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source
                    </a>
                  ) : null}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-[11px] tabular-nums text-white/70">
                    {formatTime(currentTime)}
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(1, duration)}
                    value={Math.min(duration || 0, currentTime)}
                    onChange={(e) => {
                      const el = audioRef.current;
                      if (!el) return;
                      const next = Number(e.target.value);
                      el.currentTime = next;
                      setCurrentTime(next);
                    }}
                    className="h-1 w-full accent-cyan-300"
                    aria-label="Seek"
                    disabled={!selectedAudioUrl}
                  />
                  <div className="text-[11px] tabular-nums text-white/70">
                    {formatTime(duration)}
                  </div>
                </div>

                {!selectedAudioUrl ? (
                  <p className="text-[11px] text-white/55">
                    Add a direct audio link as <span className="text-white/80">audioUrl</span> to play in-app.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="os-surface rounded-2xl px-4 py-4">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-xs text-cyan-300">$ playlist --links</p>
          <p className="text-[11px] text-zinc-100/55">{musicTracks.length} tracks</p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {musicTracks.map((t, idx) => {
            const selectedCard = idx === selectedIndex;
            return (
              <button
                key={`${t.title}-${t.url}`}
                type="button"
                onClick={() => playFromIndex(idx)}
                className={[
                  "group flex w-full items-center gap-3 rounded-2xl border p-3 text-left outline-none transition",
                  selectedCard
                    ? "border-white/18 bg-white/10 shadow-[0_18px_70px_rgba(0,0,0,0.35)]"
                    : "border-white/10 bg-white/5 hover:bg-white/8",
                  "focus-visible:ring-2 focus-visible:ring-white/20",
                ].join(" ")}
                aria-label={`Select ${t.title}`}
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  {t.posterUrl ? (
                    <img src={t.posterUrl} alt="" className="h-full w-full object-cover" draggable={false} />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold tracking-tight text-white/90">
                    {t.title}
                  </p>
                  <p className="truncate text-[11px] text-white/60">{t.artist ?? "—"}</p>
                </div>
                <div className="text-[11px] text-white/55">
                  {t.audioUrl || (t.url && isDirectAudioUrl(t.url)) ? "play" : "link"}
                </div>
              </button>
            );
          })}
        </div>
      </section>
      </div>
    </div>
  );
}

