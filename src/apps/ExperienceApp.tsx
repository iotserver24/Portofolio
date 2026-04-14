const timeline = [
  {
    period: "2023 — Present",
    title: "BTech in Advanced Communication Technology",
    org: "NMAM Institute of Technology",
    summary:
      "Building strong foundations in communication systems, networking, and modern software engineering.",
  },
  {
    period: "Founder",
    title: "Megavault",
    org: "Cloud Storage & AI Platform",
    summary:
      "Designing and running a platform that integrates encrypted cloud storage, automation, and AI‑powered services.",
  },
];

export function ExperienceApp() {
  return (
    <div className="text-white">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold sm:text-2xl">
          <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            Experience
          </span>
        </h1>
        <p className="max-w-2xl text-xs text-zinc-100/75 sm:text-sm">
          A brief snapshot of my education and the work I do around cloud storage and AI‑driven
          products.
        </p>
      </header>

      <ol className="mt-6 space-y-6 border-l border-white/10 pl-6">
        {timeline.map((item) => (
          <li key={item.title} className="relative space-y-1">
            <span className="absolute -left-[9px] top-1 inline-flex h-3 w-3 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7]" />
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-100/60">
              {item.period}
            </p>
            <h2 className="text-sm font-semibold text-white sm:text-base">
              {item.title}
              <span className="text-zinc-100/60"> · {item.org}</span>
            </h2>
            <p className="text-xs leading-relaxed text-zinc-100/75 sm:text-sm">
              {item.summary}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

