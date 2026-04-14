const activity = [
  {
    date: "2026-03-10",
    message: "launched Xibecode, an agent-native code editor",
  },
  {
    date: "2026-02-18",
    message: "open-sourced Lazy Certificate for bulk certificate generation",
  },
  {
    date: "2026-01-30",
    message: "shipped Xibe Chat CLI for terminal-first AI workflows",
  },
  {
    date: "2025-12-05",
    message: "deployed PR Review Bot for automated GitHub code reviews",
  },
];

export function ActivityApp() {
  return (
    <div className="font-mono text-[13px] text-white">
      <p className="text-xs text-zinc-300/70">$ git log --oneline --decorate</p>
      <div className="os-surface mt-4 space-y-1 rounded-2xl px-4 py-4">
        {activity.map((entry) => (
          <p key={entry.date} className="text-[11px] text-zinc-100/90">
            <span className="text-zinc-300/70">{entry.date}</span> — {entry.message}
          </p>
        ))}
      </div>

      <div className="os-surface mt-6 rounded-2xl px-4 py-4 text-[11px] text-zinc-100/90">
        <p className="text-xs text-zinc-300/70">$ stats --github</p>
        <ul className="mt-3 space-y-1">
          <li>public_repos: &gt; 40</li>
          <li>focus: cloud-storage, devtools, ai, automation</li>
          <li>langs: javascript, typescript, python, c++</li>
        </ul>
      </div>
    </div>
  );
}

