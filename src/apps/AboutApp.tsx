export function AboutApp() {
  return (
    <div className="font-mono text-[13px] text-white">
      <p className="text-xs text-zinc-300/70">$ cat ~/about/README.md</p>
      <div className="os-surface mt-4 grid gap-6 rounded-2xl px-4 py-4 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)]">
        <div className="space-y-3 text-[13px] text-zinc-100/90">
          <p className="text-xs text-emerald-300">## anish_kumar</p>
          <p>
            I am an engineering student at NMAM Institute of Technology (BTech in Advanced
            Communication Technology) and founder of Megavault, a platform that integrates cloud
            storage solutions with AI services.
          </p>
          <p>
            I enjoy full-stack development, AI integration, and building user-centric tools that
            feel fast and minimal but solve very real problems for developers and teams.
          </p>
        </div>
        <div className="space-y-3 text-[12px] text-zinc-100/80">
          <p className="text-xs text-zinc-300/70">## snapshot</p>
          <p>total_projects: based_on_portfolio_list</p>
          <p>experience_since: 2023</p>
          <p>focus: cloud-storage, devtools, ai, automation</p>
        </div>
      </div>
    </div>
  );
}

