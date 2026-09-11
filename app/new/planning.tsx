import { SourceGradient } from './source-gradient';

const clauses = [
  {
    index: '01',
    title: 'The work',
    note: 'The pages, flows, and tools we agree to ship.',
  },
  {
    index: '02',
    title: 'The calendar',
    note: 'A timeline you can plan the rest of the business around.',
  },
  {
    index: '03',
    title: 'The number',
    note: 'One price, written down before anything is built.',
  },
] as const;

export function Planning() {
  return (
    <div id="pricing" className="scroll-mt-24">
      <section className="w-full px-4 py-24 sm:px-8">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center rounded-full border border-border/60 bg-card px-3 py-1 font-medium text-muted-foreground text-xs">
              Planning
            </span>
            <h2 className="mt-5 text-balance font-serif text-4xl text-foreground leading-[1.05] sm:text-5xl">
              {'One clear scope.'}
              <br />
              {'No hidden surprises.'}
            </h2>
            <p className="mt-5 max-w-md text-pretty text-muted-foreground leading-8">
              {
                'We write the brief together — the work, the calendar, and the price — before a single hour is billed. Then we build to that brief.'
              }
            </p>
            <div className="mt-8">
              <a
                className="inline-flex items-center justify-center font-medium select-none transition-colors disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 gap-2 px-6 text-base rounded-full"
                href="#contact"
                tabIndex={0}
              >
                {'Discuss your project'}
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
            </div>
          </div>
          <ProjectBrief />
        </div>
      </section>
    </div>
  );
}

function ProjectBrief() {
  return (
    <div className="scope-folio">
      <SourceGradient variant={0} />
      <div className="scope-folio-sheet">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.65rem] text-muted-foreground uppercase tracking-[0.18em]">
              The brief
            </p>
            <p className="mt-2 font-medium text-foreground text-sm">
              Written before we start
            </p>
          </div>
          <span className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1 font-mono text-[0.65rem] text-muted-foreground">
            Scope
          </span>
        </div>
        <p className="scope-folio-lede">
          Three things locked in writing. Nothing starts until they are.
        </p>
        <ol className="scope-folio-list">
          {clauses.map((clause) => (
            <li key={clause.index}>
              <span className="scope-folio-index">{clause.index}</span>
              <div>
                <p className="font-medium text-foreground text-sm">
                  {clause.title}
                </p>
                <p className="mt-1 text-muted-foreground text-xs leading-5">
                  {clause.note}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="scope-folio-foot">
          <span>Agreed together</span>
          <span>Nothing starts unsigned</span>
        </div>
      </div>
    </div>
  );
}
