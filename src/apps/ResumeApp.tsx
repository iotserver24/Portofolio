export function ResumeApp() {
  return (
    <div className="space-y-4 text-white">
      <header className="os-surface rounded-2xl px-4 py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/55">
              Document
            </p>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Resume</h1>
            <p className="max-w-[62ch] text-xs leading-relaxed text-zinc-100/75 sm:text-sm">
              Open the PDF inline, or download it if your browser blocks embedded previews.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/my-resume.pdf"
              download
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-medium text-white/85 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              Download PDF
            </a>
            <a
              href="/my-resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-medium text-white/85 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              Open in new tab
            </a>
          </div>
        </div>
      </header>

      <section className="os-surface overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="text-xs text-white/70">/public/my-resume.pdf</p>
          <span className="text-[11px] text-white/45">PDF Viewer</span>
        </div>

        <div className="relative h-[min(72vh,760px)] w-full">
          <object
            data="/my-resume.pdf"
            type="application/pdf"
            className="h-full w-full"
            aria-label="Resume PDF"
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 py-10 text-center">
              <p className="text-sm font-semibold text-white/85">PDF preview not available</p>
              <p className="text-xs text-white/65">
                Your browser may have disabled embedded PDF previews. Use the buttons above to open
                or download the file.
              </p>
              <a
                href="/my-resume.pdf"
                className="mt-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-medium text-white/85 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                Open the PDF
              </a>
            </div>
          </object>
        </div>
      </section>
    </div>
  );
}

