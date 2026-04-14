"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AppId } from "@/os/apps";
import { appsById } from "@/os/apps";
import { useDesktopOSOptional } from "@/components/os/state/DesktopOSContext";

type TerminalLine =
  | { kind: "banner"; text: string }
  | { kind: "input"; text: string }
  | { kind: "output"; text: string }
  | { kind: "error"; text: string };

type RunResult =
  | { kind: "sync"; lines: TerminalLine[] }
  | { kind: "async"; promise: Promise<TerminalLine[]>; cancel?: () => void };

function splitArgs(input: string): string[] {
  return input.trim().split(/\s+/).filter(Boolean);
}

function formatHelp(): string {
  return [
    "Commands:",
    "  help                 Show this help",
    "  clear                Clear the terminal",
    "  whoami               About me (short)",
    "  stack                Tech stack",
    "  repo                 Repository link",
    "  open <appId>          Open an OS app (overview/projects/activity/experience/about/contact/donate/terminal)",
    "  about|projects|activity|experience|contact|donate",
    "                       Open a specific app",
    "  ai <question>         Ask the portfolio AI (streams)",
    "",
    "Tips:",
    "  - Up/Down arrow cycles through command history",
    "  - Ctrl/Cmd+K clears",
    "  - Ctrl/Cmd+C cancels an active AI response",
  ].join("\n");
}

export function TerminalApp() {
  const desktopOS = useDesktopOSOptional();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const prompt = "guest@portofolio:~$";

  const bannerLines: TerminalLine[] = useMemo(
    () => [
      { kind: "banner", text: "Portofolio Terminal" },
      { kind: "banner", text: "Type `help` to see commands." },
    ],
    [],
  );

  const [lines, setLines] = useState<TerminalLine[]>(bannerLines);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [, setHistoryIdx] = useState<number | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines.length]);

  const cancelActive = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const openIfExists = useCallback(
    (id: string): { ok: true } | { ok: false; error: string } => {
      const maybe = id as AppId;
      if (!appsById[maybe]) {
        return {
          ok: false,
          error: `Unknown app: ${id}\nTry: ${Object.keys(appsById).join(", ")}`,
        };
      }

      // Desktop: open inside window manager. Mobile: OSShell listens to `?app=...`.
      if (desktopOS) {
        desktopOS.openApp(maybe);
      } else {
        window.location.href = `/?app=${encodeURIComponent(maybe)}`;
      }
      return { ok: true };
    },
    [desktopOS],
  );

  const runCommand = useCallback(
    (raw: string): RunResult => {
      const trimmed = raw.trim();
      const [cmd, ...rest] = splitArgs(trimmed);

      if (!cmd) {
        return { kind: "sync", lines: [] };
      }

      switch (cmd) {
        case "help":
          return { kind: "sync", lines: [{ kind: "output", text: formatHelp() }] };
        case "clear":
          return {
            kind: "sync",
            lines: [],
          };
        case "whoami":
          return {
            kind: "sync",
            lines: [
              {
                kind: "output",
                text: [
                  "Hi — welcome to my portfolio.",
                  "Use `projects` to see work, or `ai <question>` to ask about anything here.",
                ].join("\n"),
              },
            ],
          };
        case "stack":
          return {
            kind: "sync",
            lines: [
              {
                kind: "output",
                text: ["Next.js (App Router)", "React", "TypeScript", "Tailwind CSS"].join("\n"),
              },
            ],
          };
        case "repo":
          return {
            kind: "sync",
            lines: [
              {
                kind: "output",
                text: "https://github.com/iotserver24/Portofolio",
              },
            ],
          };
        case "open": {
          const target = rest[0];
          if (!target) {
            return { kind: "sync", lines: [{ kind: "error", text: "Usage: open <appId>" }] };
          }
          const res = openIfExists(target);
          if (!res.ok) return { kind: "sync", lines: [{ kind: "error", text: res.error }] };
          return { kind: "sync", lines: [{ kind: "output", text: `Opened ${target}` }] };
        }
        case "about":
        case "projects":
        case "activity":
        case "experience":
        case "contact":
        case "donate": {
          const res = openIfExists(cmd);
          if (!res.ok) return { kind: "sync", lines: [{ kind: "error", text: res.error }] };
          return { kind: "sync", lines: [{ kind: "output", text: `Opened ${cmd}` }] };
        }
        case "ai":
        case "ask": {
          const question = trimmed.replace(/^(ai|ask)\s+/i, "");
          if (!question) {
            return { kind: "sync", lines: [{ kind: "error", text: `Usage: ${cmd} <question>` }] };
          }

          const controller = new AbortController();
          abortRef.current = controller;

          const promise = (async (): Promise<TerminalLine[]> => {
            try {
              const res = await fetch("/api/terminal-ai", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ question }),
                signal: controller.signal,
              });

              if (!res.ok) {
                const text = await res.text().catch(() => "");
                return [
                  {
                    kind: "error",
                    text: `AI error (${res.status}): ${text || res.statusText}`,
                  },
                ];
              }

              if (!res.body) {
                const text = await res.text().catch(() => "");
                return [{ kind: "output", text }];
              }

              const reader = res.body.getReader();
              const decoder = new TextDecoder();
              let buf = "";

              // Streamed output is rendered incrementally by updating the last line in-place.
              setLines((prev) => [...prev, { kind: "output", text: "" }]);

              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += decoder.decode(value, { stream: true });
                setLines((prev) => {
                  const next = [...prev];
                  const lastIdx = next.length - 1;
                  const last = next[lastIdx];
                  if (!last || last.kind !== "output") return next;
                  next[lastIdx] = { kind: "output", text: buf };
                  return next;
                });
              }

              abortRef.current = null;
              return [];
            } catch (e) {
              if (controller.signal.aborted) {
                abortRef.current = null;
                return [];
              }
              throw e;
            }
          })();

          return {
            kind: "async",
            promise,
            cancel: () => controller.abort(),
          };
        }
        default:
          return {
            kind: "sync",
            lines: [{ kind: "error", text: `Command not found: ${cmd}\nType \`help\`.` }],
          };
      }
    },
    [openIfExists],
  );

  const onSubmit = useCallback(
    async (raw: string) => {
      const trimmed = raw.trimEnd();

      setLines((prev) => [...prev, { kind: "input", text: `${prompt} ${trimmed}` }]);
      setValue("");
      setHistoryIdx(null);

      if (trimmed.trim()) {
        setHistory((prev) => [...prev, trimmed]);
      }

      const result = runCommand(trimmed);

      if (trimmed.trim() === "clear") {
        cancelActive();
        setIsBusy(false);
        setLines(bannerLines);
        return;
      }

      if (result.kind === "sync") {
        if (result.lines.length) {
          setLines((prev) => [...prev, ...result.lines]);
        }
        return;
      }

      setIsBusy(true);
      try {
        const extra = await result.promise;
        if (extra.length) setLines((prev) => [...prev, ...extra]);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setLines((prev) => [...prev, { kind: "error", text: msg }]);
      } finally {
        setIsBusy(false);
      }
    },
    [bannerLines, cancelActive, prompt, runCommand],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        cancelActive();
        setIsBusy(false);
        setLines(bannerLines);
        return;
      }

      if (isCmdOrCtrl && e.key.toLowerCase() === "c") {
        if (!isBusy) return;
        e.preventDefault();
        cancelActive();
        setLines((prev) => [...prev, { kind: "error", text: "^C" }]);
        setIsBusy(false);
        return;
      }

      if (e.key === "ArrowUp") {
        if (history.length === 0) return;
        e.preventDefault();
        setHistoryIdx((prev) => {
          const nextIdx = prev === null ? history.length - 1 : Math.max(0, prev - 1);
          setValue(history[nextIdx] ?? "");
          return nextIdx;
        });
        return;
      }

      if (e.key === "ArrowDown") {
        if (history.length === 0) return;
        e.preventDefault();
        setHistoryIdx((prev) => {
          if (prev === null) return null;
          const nextIdx = prev + 1;
          if (nextIdx >= history.length) {
            setValue("");
            return null;
          }
          setValue(history[nextIdx] ?? "");
          return nextIdx;
        });
      }
    },
    [bannerLines, cancelActive, history, isBusy],
  );

  return (
    <div
      className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-xl border border-white/10 bg-black/50 text-zinc-100 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]"
      onMouseDown={() => focusInput()}
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto px-4 py-3 font-mono text-[13px] leading-5"
      >
        {lines.map((l, idx) => {
          const base = "whitespace-pre-wrap break-words";
          if (l.kind === "banner") {
            return (
              <div key={idx} className={`${base} text-zinc-300`}>
                {l.text}
              </div>
            );
          }
          if (l.kind === "input") {
            return (
              <div key={idx} className={`${base} text-zinc-100`}>
                {l.text}
              </div>
            );
          }
          if (l.kind === "error") {
            return (
              <div key={idx} className={`${base} text-rose-300`}>
                {l.text}
              </div>
            );
          }
          return (
            <div key={idx} className={`${base} text-zinc-200`}>
              {l.text}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 border-t border-white/10 bg-black/40 px-4 py-3 font-mono text-[13px]">
        <span className="select-none text-zinc-300">{prompt}</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onKeyUp={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (isBusy) return;
              void onSubmit(value);
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-zinc-100 outline-none placeholder:text-zinc-500"
          placeholder={isBusy ? "Working..." : "Type a command…"}
          aria-label="Terminal input"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          disabled={false}
        />
      </div>
    </div>
  );
}

