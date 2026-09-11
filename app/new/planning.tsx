import { Contents } from './contents';

export function Planning() {
  return (
    <div id="planning" className="scroll-mt-24">
      <section className="w-full px-4 py-24 sm:px-8">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <h2 className="text-balance font-serif text-4xl text-foreground leading-[1.05] sm:text-5xl">
              {'One clear scope.'}
              <br />
              {'No hidden surprises.'}
            </h2>
            <p className="mt-5 max-w-sm text-pretty text-muted-foreground leading-8">
              {
                'We talk, then we write the work down. You approve the page before anything is built.'
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
          <Contents />
        </div>
      </section>
    </div>
  );
}
