export function DonateApp() {
  return (
    <div className="space-y-4 text-white">
      <header className="space-y-2">
        <p className="text-xs text-zinc-300/70">$ support --donate</p>
        <h1 className="text-lg font-semibold tracking-tight text-white/90">
          Support my work
        </h1>
        <p className="text-sm text-white/70">
          If you like what I build, you can support me here.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        <a
          href="https://www.buymeacoffee.com/r3ap3redit"
          target="_blank"
          rel="noreferrer"
          className="os-surface group rounded-2xl p-4 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_22px_88px_rgba(0,0,0,0.62)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white/90">
                International
              </div>
              <div className="text-xs text-white/65">
                Buy me a coffee (card / USD)
              </div>
              <div className="mt-3 inline-flex rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[12px] text-white/80">
                Open BuyMeACoffee →
              </div>
            </div>
            <div className="text-[12px] text-white/45 group-hover:text-white/60">
              r3ap3redit
            </div>
          </div>
        </a>

        <a
          href="https://razorpay.me/@megavault"
          target="_blank"
          rel="noreferrer"
          className="os-surface group rounded-2xl p-4 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_22px_88px_rgba(0,0,0,0.62)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white/90">India</div>
              <div className="text-xs text-white/65">Razorpay (INR / UPI)</div>
              <div className="mt-3 inline-flex rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[12px] text-white/80">
                Open Razorpay →
              </div>
            </div>
            <div className="text-[12px] text-white/45 group-hover:text-white/60">
              @megavault
            </div>
          </div>
        </a>
      </div>

      <div className="os-surface-2 rounded-2xl p-4 text-sm text-white/70">
        Thank you for supporting. It helps me ship more open-source tools and
        build bigger projects.
      </div>
    </div>
  );
}

