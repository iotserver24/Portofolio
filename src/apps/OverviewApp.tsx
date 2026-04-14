export function OverviewApp() {
  return (
    <div className="space-y-4 font-mono text-[13px] text-white">
      <section className="os-surface rounded-2xl px-4 py-4">
        <p className="text-xs text-emerald-300">
          $ anish --role &quot;engineering student, founder&quot;
        </p>
        <p className="mt-1 text-xs text-sky-300">$ location &quot;IN&quot;</p>
        <p className="mt-1 text-xs text-zinc-300/80">
          $ stack [ &quot;JavaScript&quot;, &quot;Node.js&quot;, &quot;Python&quot;, &quot;C++&quot;,
          &quot;React Native&quot;, &quot;Next.js&quot; ]
        </p>

        <div className="mt-5 space-y-2">
          <p className="text-zinc-100/90">
            &gt; I build tools and platforms around cloud storage, developer experience, and AI.
          </p>
          <p className="text-zinc-300/70">
            &gt; currently: Megavault, Xibe, open-source CLIs and GitHub automations.
          </p>
        </div>
      </section>

      <section className="os-surface rounded-2xl px-4 py-4">
        <p className="text-xs text-zinc-300/70">$ highlights --recent</p>
        <ul className="mt-3 space-y-1 text-xs text-zinc-100/90">
          <li>[x] Launched Xibecode, an agent-native code editor.</li>
          <li>[x] Open-sourced Lazy Certificate for bulk certificate generation.</li>
          <li>[x] Shipped Xibe Chat CLI and PR Review Bot for GitHub.</li>
        </ul>
      </section>
    </div>
  );
}

