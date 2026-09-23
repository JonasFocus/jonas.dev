import { Check, Phone, Rocket, Wrench } from 'lucide-react';
import Image from 'next/image';
import { SourceGradient } from './source-gradient';

export function Services() {
  return (
    <div id="product" className="scroll-mt-24">
      <section className="w-full px-4 py-20 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-end lg:gap-12">
            <div>
              <span className="inline-flex items-center rounded-full border border-border/60 bg-card px-3 py-1 font-medium text-muted-foreground text-xs">
                {'Why work with Jonas'}
              </span>
              <h2 className="block mt-5 text-balance font-serif text-3xl text-foreground leading-[1.05] sm:text-5xl">
                {'Built for people with something to launch.'}
              </h2>
            </div>
            <p className="text-pretty text-muted-foreground text-sm leading-7 sm:text-base lg:pb-2">
              {
                'A website, a web app, and the pieces that make it a real business tool — then you leave with the keys.'
              }
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <div className="relative h-[26rem] overflow-hidden rounded-2xl">
                <SourceGradient variant={1} />
                <div className="absolute inset-0">
                  <div className="absolute inset-5 overflow-hidden rounded-[1.4rem] border border-border/70 bg-background/90 text-foreground shadow-[0_24px_64px_-40px_color-mix(in_oklch,var(--foreground)_40%,transparent)] backdrop-blur-xl">
                    <div className="flex h-full flex-col p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">
                            {'What you get'}
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            {'Site, app, and the working pieces.'}
                          </p>
                        </div>
                        <span className="rounded-full bg-success/12 px-2 py-1 font-medium text-[9px] text-success">
                          {'Full stack'}
                        </span>
                      </div>
                      <div className="relative mt-6 flex-1">
                        <div className="absolute top-1/2 left-0 z-10 flex -translate-y-1/2 items-center gap-2 rounded-xl bg-background px-2.5 py-2">
                          <Image
                            width={24}
                            height={24}
                            src="/new/nextjs.svg"
                            alt=""
                            aria-hidden="true"
                            className="size-6 rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-xs">{'Site'}</p>
                            <p className="text-[9px] text-muted-foreground">
                              {'LIVE'}
                            </p>
                          </div>
                        </div>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 240 140"
                          preserveAspectRatio="none"
                          className="absolute inset-0 size-full overflow-visible text-foreground/45"
                          fill="none"
                        >
                          <title>{'Site, app, and business pieces'}</title>
                          <path
                            d="M66 70C100 70 104 20 146 20H180"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            pathLength="1"
                            strokeDashoffset="0"
                            strokeDasharray="1 1"
                          />
                          <path
                            d="M66 70C100 70 104 120 146 120H180"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            pathLength="1"
                            strokeDashoffset="0"
                            strokeDasharray="1 1"
                          />
                        </svg>
                        <div className="absolute z-10 flex w-24 items-center justify-between rounded-xl bg-background px-2.5 py-2 top-1 right-0">
                          <span className="text-[10px]">{'App'}</span>
                          <span className="font-mono text-[9px] text-muted-foreground">
                            {'tools'}
                          </span>
                        </div>
                        <div className="absolute z-10 flex w-24 items-center justify-between rounded-xl bg-background px-2.5 py-2 right-0 bottom-1">
                          <span className="text-[10px]">{'Pieces'}</span>
                          <span className="font-mono text-[9px] text-muted-foreground">
                            {'ops'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-5 flex items-center justify-between rounded-xl bg-foreground px-3 py-2.5 text-background">
                        <span className="text-[10px] text-background/60">
                          {'Deliverable'}
                        </span>
                        <span className="font-semibold text-sm tabular-nums">
                          {'A real business tool'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="mt-4 font-medium text-foreground text-xl">
                {'What you get'}
              </h3>
              <p className="mt-1 text-pretty text-muted-foreground text-sm">
                {
                  'A site, an app when you need one, and the pieces that make it a real business tool — forms, data, and the daily workflow.'
                }
              </p>
            </div>
            <div>
              <div className="relative h-[26rem] overflow-hidden rounded-2xl">
                <SourceGradient variant={3} />
                <div className="absolute inset-0">
                  <div className="absolute inset-5 overflow-hidden rounded-[1.4rem] border border-border/70 bg-background/90 text-foreground shadow-[0_24px_64px_-40px_color-mix(in_oklch,var(--foreground)_40%,transparent)] backdrop-blur-xl">
                    <div className="flex h-full flex-col p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">
                            {'How a project runs'}
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            {'First call → build → live'}
                          </p>
                        </div>
                        <span className="grid size-7 place-items-center rounded-full bg-success text-background">
                          <Check
                            size={16}
                            strokeWidth={2.5}
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <div className="mt-5 border-border border-b pb-4">
                        <p className="text-[10px] text-muted-foreground">
                          The path
                        </p>
                        <p className="mt-2 text-xl font-medium tracking-tight">
                          Weeks you can picture.
                        </p>
                      </div>
                      <ul className="mt-3 flex flex-col gap-1.5">
                        {[
                          { label: 'First call', week: 'Week 1', icon: Phone },
                          { label: 'Build', week: 'Weeks 2–4', icon: Wrench },
                          { label: 'Live', week: 'Week 5+', icon: Rocket },
                        ].map(({ label, week, icon: Icon }) => (
                          <li
                            key={label}
                            className="flex items-center gap-2.5 rounded-xl px-2 py-2"
                          >
                            <span className="grid size-7 place-items-center rounded-lg bg-muted text-muted-foreground">
                              <Icon size={15} aria-hidden="true" />
                            </span>
                            <span className="flex-1 text-[11px]">{label}</span>
                            <span className="inline-flex items-center gap-1.5 text-[10px] text-success">
                              {week}
                              <span className="grid size-4 place-items-center rounded-full bg-success/12">
                                <Check
                                  size={10}
                                  strokeWidth={2.8}
                                  aria-hidden="true"
                                />
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-background">
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
                          className="lucide lucide-lock-keyhole size-3.5"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="16" r="1" />
                          <rect x="3" y="10" width="18" height="12" rx="2" />
                          <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                        </svg>
                        <span className="font-medium text-[10px]">
                          {'From idea to launch'}
                        </span>
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
                          className="lucide lucide-arrow-down size-3 rotate-[-90deg]"
                          aria-hidden="true"
                        >
                          <path d="M12 5v14" />
                          <path d="m19 12-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="mt-4 font-medium text-foreground text-xl">
                {'How a project runs'}
              </h3>
              <p className="mt-1 text-pretty text-muted-foreground text-sm">
                {
                  'First call, then build, then live — a path measured in weeks you can picture, with working previews along the way.'
                }
              </p>
            </div>
            <div>
              <div className="relative h-[26rem] overflow-hidden rounded-2xl">
                <SourceGradient variant={2} />
                <div className="absolute inset-0">
                  <div className="absolute inset-5 overflow-hidden rounded-[1.4rem] border border-border/70 bg-background/90 text-foreground shadow-[0_24px_64px_-40px_color-mix(in_oklch,var(--foreground)_40%,transparent)] backdrop-blur-xl">
                    <div className="relative h-full p-4">
                      <div>
                        <p className="font-medium text-sm">
                          {'You leave with the keys'}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {'Your code. Your accounts. Your data.'}
                        </p>
                      </div>
                      <div className="absolute inset-x-0 top-[46%] grid -translate-y-1/2 place-items-center">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 260 220"
                          className="absolute size-64 text-foreground/25"
                          fill="none"
                        >
                          <title>
                            {'Source code, accounts, and data ownership'}
                          </title>
                          <path
                            d="M130 110L58 56"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeDasharray="1 1"
                            pathLength="1"
                            strokeDashoffset="0"
                          />
                          <path
                            d="M130 110L202 56"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeDasharray="1 1"
                            pathLength="1"
                            strokeDashoffset="0"
                          />
                          <path
                            d="M130 110L130 180"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeDasharray="1 1"
                            pathLength="1"
                            strokeDashoffset="0"
                          />
                        </svg>
                        <div className="relative z-10 grid size-20 place-items-center rounded-[1.4rem] bg-foreground text-background shadow-[0_20px_42px_-24px_color-mix(in_oklch,var(--foreground)_60%,transparent)]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-fingerprint-pattern size-8"
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
                          <span
                            aria-hidden="true"
                            className="absolute inset-2 rounded-xl border border-background/20"
                          ></span>
                        </div>
                        <div
                          className="absolute z-20 flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1.5 text-[10px]"
                          style={{ transform: 'translate(-72px, -54px)' }}
                        >
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
                            className="lucide lucide-key-round size-3 text-muted-foreground"
                            aria-hidden="true"
                          >
                            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                            <circle
                              cx="16.5"
                              cy="7.5"
                              r=".5"
                              fill="currentColor"
                            />
                          </svg>
                          {'Source'}
                        </div>
                        <div
                          className="absolute z-20 flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1.5 text-[10px]"
                          style={{ transform: 'translate(72px, -54px)' }}
                        >
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
                            className="lucide lucide-key-round size-3 text-muted-foreground"
                            aria-hidden="true"
                          >
                            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                            <circle
                              cx="16.5"
                              cy="7.5"
                              r=".5"
                              fill="currentColor"
                            />
                          </svg>
                          {'Accounts'}
                        </div>
                        <div
                          className="absolute z-20 flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1.5 text-[10px]"
                          style={{ transform: 'translateY(70px)' }}
                        >
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
                            className="lucide lucide-key-round size-3 text-muted-foreground"
                            aria-hidden="true"
                          >
                            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                            <circle
                              cx="16.5"
                              cy="7.5"
                              r=".5"
                              fill="currentColor"
                            />
                          </svg>
                          {'Data'}
                        </div>
                      </div>
                      <div className="absolute right-4 bottom-4 left-4 flex items-center gap-3 border-border border-t pt-3">
                        <span className="grid size-8 place-items-center rounded-full bg-success/12 text-success">
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
                            className="lucide lucide-shield-check size-4"
                            aria-hidden="true"
                          >
                            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                        </span>
                        <div>
                          <p className="font-medium text-[11px]">
                            {'Built for handover'}
                          </p>
                          <p className="mt-0.5 text-[9px] text-muted-foreground">
                            {'Everything stays in your hands'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="mt-4 font-medium text-foreground text-xl">
                {'You leave with the keys'}
              </h3>
              <p className="mt-1 text-pretty text-muted-foreground text-sm">
                {
                  'Code, accounts, and data stay in your name. You can run it, move it, or take it to another developer.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
