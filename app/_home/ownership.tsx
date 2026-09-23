export function Ownership() {
  return (
    <section id="security" className="w-full scroll-mt-24 px-4 py-24 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
        <div>
          <span className="inline-flex items-center rounded-full border border-border bg-card px-3.5 py-1.5 font-medium text-muted-foreground text-xs">
            {'Your project, your control'}
          </span>
          <h2 className="mt-6 max-w-lg text-balance font-serif text-4xl text-foreground leading-[1.03] tracking-[-0.02em] sm:text-5xl">
            {'The last word is always yours.'}
          </h2>
          <p className="mt-5 max-w-sm text-pretty text-muted-foreground leading-7">
            {
              'We bring design and development into one conversation. You see the work, understand the decisions, and approve what comes next.'
            }
          </p>
          <div className="mt-9 flex items-end gap-5">
            <span className="font-serif text-7xl text-foreground leading-none tracking-[-0.06em] sm:text-8xl">
              {'0'}
            </span>
            <div className="pb-1.5">
              <p className="font-medium text-foreground text-sm">
                {'unwanted surprises'}
              </p>
              <p className="mt-1 max-w-40 text-muted-foreground text-xs leading-5">
                {'clear scope before the work begins'}
              </p>
            </div>
          </div>
          <div className="mt-8 border-border border-t">
            <div className="grid grid-cols-[1.75rem_1fr] gap-3 border-border border-b py-4">
              <span className="pt-0.5 font-mono text-[0.7rem] text-accent tabular-nums">
                {'0'}
                {'1'}
              </span>
              <div>
                <h3 className="font-medium text-foreground text-sm">
                  {'No agency handoffs.'}
                </h3>
                <p className="mt-1 text-pretty text-muted-foreground text-xs leading-5">
                  {
                    'You talk directly with the person designing and building your product.'
                  }
                </p>
              </div>
            </div>
            <div className="grid grid-cols-[1.75rem_1fr] gap-3 border-border border-b py-4">
              <span className="pt-0.5 font-mono text-[0.7rem] text-accent tabular-nums">
                {'0'}
                {'2'}
              </span>
              <div>
                <h3 className="font-medium text-foreground text-sm">
                  {'No hidden scope.'}
                </h3>
                <p className="mt-1 text-pretty text-muted-foreground text-xs leading-5">
                  {
                    'Review the deliverables, timeline, and price before we begin.'
                  }
                </p>
              </div>
            </div>
            <div className="grid grid-cols-[1.75rem_1fr] gap-3 border-border border-b py-4">
              <span className="pt-0.5 font-mono text-[0.7rem] text-accent tabular-nums">
                {'0'}
                {'3'}
              </span>
              <div>
                <h3 className="font-medium text-foreground text-sm">
                  {'No locked doors.'}
                </h3>
                <p className="mt-1 text-pretty text-muted-foreground text-xs leading-5">
                  {'Your source code and project accounts stay in your hands.'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_30px_70px_-45px_rgb(0_0_0/0.35)]">
            <div className="flex justify-center pt-3">
              <span className="h-1 w-9 rounded-full bg-muted-foreground/25"></span>
            </div>
            <div className="p-6 pt-4 sm:p-7 sm:pt-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-foreground text-background">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-wallet size-4"
                      aria-hidden="true"
                    >
                      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm">
                      {'Release approval'}
                    </p>
                    <p className="truncate font-mono text-[0.65rem] text-muted-foreground">
                      {'your-project · release v1.0'}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-accent/15 px-3 py-1 font-medium text-[0.65rem] text-accent">
                  {'Preview'}
                </span>
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4">
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs">
                    {'Release version'}
                  </p>
                  <p className="mt-1 font-semibold text-3xl text-foreground tracking-tight">
                    {'1.0'}{' '}
                    <span className="text-lg text-muted-foreground">
                      {'APP'}
                    </span>
                  </p>
                </div>
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-full font-semibold text-[0.65rem] text-white"
                  style={{ backgroundColor: '#5b8def' }}
                >
                  {'APP'}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-y-5 text-xs">
                <div className="min-w-0">
                  <p className="truncate text-[0.65rem] text-muted-foreground">
                    {'Environment'}
                  </p>
                  <p className="mt-1 truncate font-medium font-mono text-foreground text-xs">
                    {'Production'}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[0.65rem] text-muted-foreground">
                    {'Project'}
                  </p>
                  <p className="mt-1 truncate font-medium font-mono text-foreground text-xs">
                    {'your-project'}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[0.65rem] text-muted-foreground">
                    {'Deliverable'}
                  </p>
                  <p className="mt-1 truncate font-medium font-mono text-foreground text-xs">
                    {'Source + handover'}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[0.65rem] text-muted-foreground">
                    {'Status'}
                  </p>
                  <p className="mt-1 truncate font-medium font-mono text-foreground text-xs">
                    {'Ready'}
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-xl bg-muted px-4 py-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.65rem] text-muted-foreground uppercase tracking-[0.14em]">
                    {'Your approval'}
                  </span>
                  <span className="font-mono text-[0.65rem] text-muted-foreground">
                    {'v1.0'}
                  </span>
                </div>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 320 54"
                  className="mt-3 h-12 w-full overflow-visible text-accent"
                  fill="none"
                >
                  <title>{'Device signature trace'}</title>
                  <path
                    d="M4 38C38 36 43 10 61 17C74 22 61 43 82 38C102 33 107 9 125 13C142 18 126 41 148 35C168 29 174 8 191 14C207 20 194 42 215 35C238 27 246 14 263 19C278 24 286 31 316 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    pathLength="1"
                    strokeDashoffset="0"
                    strokeDasharray="1 1"
                  />
                </svg>
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-foreground p-4 text-background">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-background/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-fingerprint-pattern size-5"
                    aria-hidden="true"
                  >
                    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                    <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                    <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
                    <path d="M2 12a10 10 0 0 1 18-6" />
                    <path d="M2 16h.01" />
                    <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                    <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
                    <path d="M8.65 22c.21-.66.45-1.32.57-2" />
                    <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{'Approved by you'}</p>
                  <p className="mt-0.5 text-background/60 text-xs">
                    {'Reviewed together. Ready for your launch.'}
                  </p>
                </div>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check size-4"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
