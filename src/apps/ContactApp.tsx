export function ContactApp() {
  return (
    <div className="font-mono text-[13px] text-white">
      <p className="text-xs text-zinc-300/70">$ open ~/contact</p>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <form
          action="https://formsubmit.co/iotserver24@gmail.com"
          method="POST"
          className="os-surface space-y-4 rounded-2xl p-4 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_22px_88px_rgba(0,0,0,0.62)]"
        >
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="New message from portfolio website" />

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-100/80" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-[12px] outline-none transition focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/25"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-100/80" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-[12px] outline-none transition focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/25"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-100/80" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-[12px] outline-none transition focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/25"
              placeholder="Tell me a bit about what you have in mind..."
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-4 py-2 text-[12px] font-semibold text-emerald-200 hover:bg-emerald-500/20"
          >
            $ send
          </button>
        </form>

        <aside className="os-surface space-y-4 rounded-2xl p-4 text-[12px] text-zinc-100/85">
          <p className="text-xs text-zinc-300/70">$ contact --options</p>
          <ul className="mt-3 space-y-2">
            <li>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-zinc-100/60">
                email
              </span>
              <a
                href="mailto:support@megavault.in"
                className="text-[11px] text-sky-300 hover:text-sky-200"
              >
                $ mailto support@megavault.in
              </a>
            </li>
            <li>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-zinc-100/60">
                linkedin
              </span>
              <a
                href="https://www.linkedin.com/in/anish-kumar-1a5bb133a/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-300 hover:text-sky-200"
              >
                $ open linkedin/anish-kumar-1a5bb133a
              </a>
            </li>
            <li>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-zinc-100/60">
                github
              </span>
              <a
                href="https://github.com/iotserver24"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-300 hover:text-sky-200"
              >
                $ open github.com/iotserver24
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

