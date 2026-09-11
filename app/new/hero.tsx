import Image from 'next/image';
import { SourceGradient } from './source-gradient';
import { ReviewPill } from './review-pill';

export function Hero() {
  return (
    <section className="w-full overflow-hidden px-4 py-16 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
        <div className="min-w-0 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 font-medium text-foreground text-sm">
            {'Websites & SaaS development'}
          </span>
          <h1 className="mt-6 text-balance font-serif text-5xl text-foreground tracking-tight sm:text-6xl">
            {'Your idea, every page, one partner'}
          </h1>
          <p className="mt-5 max-w-md text-pretty text-base text-muted-foreground leading-7">
            {
              'We build websites and SaaS products for founders and small businesses. Design, development, and launch, with a shared understanding of your product.'
            }
          </p>
          <div className="mt-8">
            <div className="review-pill-placement"><ReviewPill /></div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                className="inline-flex items-center justify-center font-medium select-none transition-colors disabled:pointer-events-none disabled:opacity-50 border border-border bg-card text-foreground h-12 gap-2 px-6 text-base rounded-full"
                href="#contact"
                tabIndex={0}
              >
                {'Start your project'}
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
                  className="lucide lucide-arrow-right size-4"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
              <a
                className="inline-flex items-center justify-center font-medium select-none transition-colors disabled:pointer-events-none disabled:opacity-50 border border-border bg-card text-foreground hover:border-border h-12 gap-2 px-6 text-base rounded-full"
                href="#security"
                tabIndex={0}
              >
                {'How we work'}
              </a>
            </div>
          </div>
          <div className="mt-16 lg:mt-24">
            <p className="text-muted-foreground/80 text-xs">
              {'Built with the tools behind modern websites and SaaS'}
            </p>
            <div className="mt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_88%,transparent)]">
              <div className="flex w-max">
                <div className="flex w-max gap-8" style={{ transform: 'none' }}>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/nextjs.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Next.js'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/react.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'React'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/typescript.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'TypeScript'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/tailwindcss.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Tailwind'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/nodejs.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Node.js'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/postgresql.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'PostgreSQL'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/vercel.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Vercel'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/github.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'GitHub'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/nextjs.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Next.js'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/react.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'React'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/typescript.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'TypeScript'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/tailwindcss.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Tailwind'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/nodejs.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Node.js'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/postgresql.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'PostgreSQL'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/vercel.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Vercel'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/github.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'GitHub'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/nextjs.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Next.js'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/react.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'React'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/typescript.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'TypeScript'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/tailwindcss.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Tailwind'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/nodejs.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Node.js'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/postgresql.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'PostgreSQL'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/vercel.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Vercel'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/github.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'GitHub'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/nextjs.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Next.js'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/react.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'React'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/typescript.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'TypeScript'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/tailwindcss.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Tailwind'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/nodejs.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Node.js'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/postgresql.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'PostgreSQL'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/vercel.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'Vercel'}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-base text-muted-foreground/60">
                    <Image
                      width={24}
                      height={24}
                      src="/new/github.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-5 rounded-full object-contain"
                    />
                    {'GitHub'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full min-w-0 lg:mr-[calc(50%-50vw)] lg:w-auto">
          <div className="relative overflow-hidden rounded-tl-3xl border border-border/60">
            <SourceGradient variant={0} />
            <div className="relative overflow-hidden pt-5 pl-8 sm:pt-8 sm:pl-14">
              <div className="-mr-4 rounded-tl-[1.5rem] bg-background/15 p-1.5 pr-0 pb-0 backdrop-blur-md sm:-mr-6">
                <div className="relative overflow-hidden rounded-tl-2xl border border-border/60 bg-card">
                  <div className="flex items-center justify-between border-border/60 border-b px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="grid size-5 place-items-center rounded-full bg-foreground text-background">
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
                          className="lucide lucide-wallet size-3"
                          aria-hidden="true"
                        >
                          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                        </svg>
                      </span>
                      <span className="font-semibold text-foreground text-xs">
                        {'Jonas'}
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
                        className="lucide lucide-panel-left size-3.5 text-muted-foreground/50"
                        aria-hidden="true"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M9 3v18" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
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
                        className="lucide lucide-layout-grid size-3"
                        aria-hidden="true"
                      >
                        <rect width="7" height="7" x="3" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="14" rx="1" />
                        <rect width="7" height="7" x="3" y="14" rx="1" />
                      </svg>
                      {'Overview'}
                      <span className="rounded-full border border-border/60 px-1.5 py-px text-[10px]">
                        {'Sample data'}
                      </span>
                    </div>
                  </div>
                  <div className="flex">
                    <aside className="hidden w-44 shrink-0 flex-col border-border/60 border-r p-2.5 sm:flex">
                      <p className="px-2 py-1 text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                        {'Workspace'}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs bg-foreground/[0.06] font-medium text-foreground">
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
                            className="lucide lucide-layout-grid size-3.5 shrink-0"
                            aria-hidden="true"
                          >
                            <rect width="7" height="7" x="3" y="3" rx="1" />
                            <rect width="7" height="7" x="14" y="3" rx="1" />
                            <rect width="7" height="7" x="14" y="14" rx="1" />
                            <rect width="7" height="7" x="3" y="14" rx="1" />
                          </svg>
                          <span className="flex-1 truncate">{'Overview'}</span>
                        </span>
                        <span className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground">
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
                            className="lucide lucide-coins size-3.5 shrink-0"
                            aria-hidden="true"
                          >
                            <path d="M13.744 17.736a6 6 0 1 1-7.48-7.48" />
                            <path d="M15 6h1v4" />
                            <path d="m6.134 14.768.866-.5 2 3.464" />
                            <circle cx="16" cy="8" r="6" />
                          </svg>
                          <span className="flex-1 truncate">{'Projects'}</span>
                          <span className="rounded-full bg-foreground/[0.06] px-1.5 py-px text-[10px] text-muted-foreground">
                            {'12'}
                          </span>
                        </span>
                        <span className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground">
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
                            className="lucide lucide-arrow-left-right size-3.5 shrink-0"
                            aria-hidden="true"
                          >
                            <path d="M8 3 4 7l4 4" />
                            <path d="M4 7h16" />
                            <path d="m16 21 4-4-4-4" />
                            <path d="M20 17H4" />
                          </svg>
                          <span className="flex-1 truncate">{'Workflow'}</span>
                        </span>
                        <span className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground">
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
                            className="lucide lucide-activity size-3.5 shrink-0"
                            aria-hidden="true"
                          >
                            <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
                          </svg>
                          <span className="flex-1 truncate">{'Activity'}</span>
                        </span>
                        <span className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground">
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
                            className="lucide lucide-trending-up size-3.5 shrink-0"
                            aria-hidden="true"
                          >
                            <path d="M16 7h6v6" />
                            <path d="m22 7-8.5 8.5-5-5L2 17" />
                          </svg>
                          <span className="flex-1 truncate">{'Reports'}</span>
                        </span>
                        <span className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground">
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
                            className="lucide lucide-settings size-3.5 shrink-0"
                            aria-hidden="true"
                          >
                            <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <span className="flex-1 truncate">{'Settings'}</span>
                        </span>
                      </div>
                      <div className="mt-auto pt-3">
                        <div className="rounded-xl border border-border/60 bg-background p-2.5">
                          <p className="text-[10px] text-muted-foreground">
                            {'Demo · sample data'}
                          </p>
                          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                            <div className="h-full w-[62%] rounded-full bg-foreground"></div>
                          </div>
                          <div className="mt-2 rounded-lg bg-foreground py-1.5 text-center font-medium text-[10px] text-background">
                            {'View project plan'}
                          </div>
                        </div>
                        <div className="mt-2.5 flex items-center gap-2">
                          <Image
                            width={24}
                            height={24}
                            src="/new/avatar.svg"
                            alt=""
                            aria-hidden="true"
                            className="size-6 rounded-full"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-[11px] text-foreground">
                              {'your-workspace'}
                            </p>
                            <p className="truncate font-mono text-[10px] text-muted-foreground">
                              {'Admin account'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </aside>
                    <div className="min-w-0 flex-1 p-4 sm:p-5">
                      <p className="text-muted-foreground text-xs">
                        {'Monthly revenue'}
                      </p>
                      <div className="mt-1 flex items-end gap-2">
                        <p className="flex items-end gap-1 font-semibold text-3xl text-foreground tabular-nums tracking-tight">
                          <span>{'$'}</span>
                          <span className="inline-flex items-center tabular-nums">
                            <span className="font-mono">{'128,540'}</span>
                          </span>
                          <span className="pb-0.5 text-lg text-muted-foreground">
                            {'.28'}
                          </span>
                        </p>
                        <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-success/12 px-1.5 py-0.5 font-medium text-[0.65rem] text-success">
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
                            className="lucide lucide-trending-up size-2.5"
                            aria-hidden="true"
                          >
                            <path d="M16 7h6v6" />
                            <path d="m22 7-8.5 8.5-5-5L2 17" />
                          </svg>
                          {'+4.2%'}
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="min-w-0 rounded-xl border border-border/60 bg-background p-3">
                          <p className="text-[11px] text-muted-foreground">
                            {'This month'}
                          </p>
                          <div className="mt-1 flex h-7 min-w-0 items-center gap-1.5 whitespace-nowrap">
                            <span className="inline-flex items-center shrink-0 font-semibold text-foreground text-xl leading-none tabular-nums">
                              <span className="font-mono">{'+$4,910'}</span>
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 rounded-xl border border-border/60 bg-background p-3">
                          <p className="text-[11px] text-muted-foreground">
                            {'Projects'}
                          </p>
                          <div className="mt-1 flex h-7 min-w-0 items-center gap-1.5 whitespace-nowrap">
                            <span className="inline-flex items-center shrink-0 font-semibold text-foreground text-xl leading-none tabular-nums">
                              <span className="font-mono">{'12'}</span>
                            </span>
                            <span className="truncate text-muted-foreground text-[11px] leading-none">
                              {'· sample data'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 rounded-xl border border-border/60">
                        <div className="flex items-center justify-between px-3 py-2.5">
                          <span className="font-medium text-foreground text-xs">
                            {'Product overview'}
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
                            className="lucide lucide-chevron-right size-3.5 text-muted-foreground"
                            aria-hidden="true"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </div>
                        <div className="divide-y divide-border/50">
                          <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 px-3 py-2 text-xs">
                            <span className="flex min-w-0 items-center gap-2">
                              <Image
                                width={24}
                                height={24}
                                src="/new/nextjs.svg"
                                alt=""
                                aria-hidden="true"
                                className="size-6 shrink-0 rounded-full object-contain"
                              />
                              <span className="truncate font-medium text-foreground">
                                {'Next.js'}
                              </span>
                              <span className="hidden text-muted-foreground sm:inline">
                                {'Website'}
                              </span>
                            </span>
                            <span className="whitespace-nowrap text-right">
                              <span className="font-mono text-foreground tabular-nums">
                                {'$'}
                                {'61,204'}
                              </span>
                              <span className="ml-2 tabular-nums text-success">
                                {'+3.8%'}
                              </span>
                            </span>
                          </div>
                          <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 px-3 py-2 text-xs">
                            <span className="flex min-w-0 items-center gap-2">
                              <Image
                                width={24}
                                height={24}
                                src="/new/react.svg"
                                alt=""
                                aria-hidden="true"
                                className="size-6 shrink-0 rounded-full object-contain"
                              />
                              <span className="truncate font-medium text-foreground">
                                {'React'}
                              </span>
                              <span className="hidden text-muted-foreground sm:inline">
                                {'Application'}
                              </span>
                            </span>
                            <span className="whitespace-nowrap text-right">
                              <span className="font-mono text-foreground tabular-nums">
                                {'$'}
                                {'48,930'}
                              </span>
                              <span className="ml-2 tabular-nums text-success">
                                {'+6.1%'}
                              </span>
                            </span>
                          </div>
                          <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 px-3 py-2 text-xs">
                            <span className="flex min-w-0 items-center gap-2">
                              <Image
                                width={24}
                                height={24}
                                src="/new/typescript.svg"
                                alt=""
                                aria-hidden="true"
                                className="size-6 shrink-0 rounded-full object-contain"
                              />
                              <span className="truncate font-medium text-foreground">
                                {'TypeScript'}
                              </span>
                              <span className="hidden text-muted-foreground sm:inline">
                                {'Platform'}
                              </span>
                            </span>
                            <span className="whitespace-nowrap text-right">
                              <span className="font-mono text-foreground tabular-nums">
                                {'$'}
                                {'18,406'}
                              </span>
                              <span className="ml-2 tabular-nums text-success">
                                {'0.0%'}
                              </span>
                            </span>
                          </div>
                          <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 px-3 py-2 text-xs">
                            <span className="flex min-w-0 items-center gap-2">
                              <Image
                                width={24}
                                height={24}
                                src="/new/github.svg"
                                alt=""
                                aria-hidden="true"
                                className="size-6 shrink-0 rounded-full object-contain"
                              />
                              <span className="truncate font-medium text-foreground">
                                {'GitHub'}
                              </span>
                              <span className="hidden text-muted-foreground sm:inline">
                                {'Repository'}
                              </span>
                            </span>
                            <span className="whitespace-nowrap text-right">
                              <span className="font-mono text-foreground tabular-nums">
                                {'$'}
                                {'14,880'}
                              </span>
                              <span className="ml-2 tabular-nums text-destructive">
                                {'-1.2%'}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-4 mb-2 font-medium text-foreground text-xs">
                        {'Recent activity'}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-border/60 bg-background p-3">
                          <div className="flex items-center justify-between">
                            <span className="grid size-7 place-items-center rounded-full bg-foreground/[0.06] text-foreground">
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
                                className="lucide lucide-arrow-left-right size-3.5"
                                aria-hidden="true"
                              >
                                <path d="M8 3 4 7l4 4" />
                                <path d="M4 7h16" />
                                <path d="m16 21 4-4-4-4" />
                                <path d="M20 17H4" />
                              </svg>
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {'2m ago'}
                            </span>
                          </div>
                          <p className="mt-2 truncate font-medium text-[11px] text-foreground">
                            {'Website → Published'}
                          </p>
                          <p className="truncate text-[10px] text-muted-foreground">
                            {'Production deployment'}
                          </p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-background p-3">
                          <div className="flex items-center justify-between">
                            <span className="grid size-7 place-items-center rounded-full bg-foreground/[0.06] text-foreground">
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
                                className="lucide lucide-arrow-left-right size-3.5"
                                aria-hidden="true"
                              >
                                <path d="M8 3 4 7l4 4" />
                                <path d="M4 7h16" />
                                <path d="m16 21 4-4-4-4" />
                                <path d="M20 17H4" />
                              </svg>
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {'1h ago'}
                            </span>
                          </div>
                          <p className="mt-2 truncate font-medium text-[11px] text-foreground">
                            {'Dashboard → Updated'}
                          </p>
                          <p className="truncate text-[10px] text-muted-foreground">
                            {'New release'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
