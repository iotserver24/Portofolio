const timeline = [
  {
    period: "2024 — Present",
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
      <header className="os-surface relative overflow-hidden rounded-2xl px-4 py-4">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 -top-10 h-44 w-44 rounded-full bg-[#6366f1]/18 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-[#a855f7]/18 blur-3xl"
        />

        <div className="relative flex flex-col gap-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/55">
            Timeline
          </p>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
              Experience
            </span>
          </h1>
          <p className="max-w-[62ch] text-xs leading-relaxed text-zinc-100/75 sm:text-sm">
            A brief snapshot of my education and the work I do around cloud storage and AI‑driven
            products.
          </p>
        </div>
      </header>

      <ol className="mt-4 space-y-3">
        {timeline.map((item) => (
          <li key={`${item.title}-${item.org}`} className="group relative">
            <div className="os-surface relative overflow-hidden rounded-2xl px-4 py-4 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_22px_88px_rgba(0,0,0,0.62)]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              >
                <div className="absolute -left-16 -top-20 h-52 w-52 rounded-full bg-[#6366f1]/10 blur-3xl" />
                <div className="absolute -bottom-20 -right-16 h-52 w-52 rounded-full bg-[#a855f7]/10 blur-3xl" />
              </div>

              <div className="relative flex items-start gap-3">
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-100/60">
                      {item.period}
                    </p>
                    <span className="text-[10px] text-white/20">•</span>
                    <p className="text-[11px] font-medium text-white/70">{item.org}</p>
                  </div>

                  <h2 className="mt-1 text-sm font-semibold tracking-tight text-white sm:text-base">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-xs leading-relaxed text-zinc-100/75 sm:text-sm">
                    {item.summary}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

