import { Contact } from './interactions';
export function Invitation() {
  return (
    <section className="w-full px-4 pb-24 sm:px-8" id="contact">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 text-center sm:py-28">
        <div className="mx-auto max-w-xl">
          <h2 className="text-balance font-serif text-4xl text-foreground leading-[1.05] sm:text-5xl">
            {'Give your idea a place to grow.'}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-pretty text-muted-foreground leading-7">
            {
              'A website, a SaaS product, or a better way to work. Tell us what you have in mind and we can work out the next step.'
            }
          </p>
          <div className="mt-6"><ReviewPill /></div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Contact />
            <a
              className="inline-flex items-center justify-center font-medium select-none transition-colors disabled:pointer-events-none disabled:opacity-50 border border-border bg-card text-foreground hover:border-border h-12 gap-2 px-6 text-base rounded-full"
              href="#product"
              tabIndex={0}
            >
              {'Explore services'}
            </a>
          </div>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 divide-x divide-border border-border border-y py-4 text-left">
            <div className="px-3 text-center sm:px-5">
              <p className="font-semibold text-foreground text-sm tabular-nums">
                {'1:1'}
              </p>
              <p className="mt-0.5 text-muted-foreground text-xs">
                {'direct collaboration'}
              </p>
            </div>
            <div className="px-3 text-center sm:px-5">
              <p className="font-semibold text-foreground text-sm tabular-nums">
                {'3'}
              </p>
              <p className="mt-0.5 text-muted-foreground text-xs">
                {'core services'}
              </p>
            </div>
            <div className="px-3 text-center sm:px-5">
              <p className="font-semibold text-foreground text-sm tabular-nums">
                {'Yours'}
              </p>
              <p className="mt-0.5 text-muted-foreground text-xs">
                {'from day one'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import { ReviewPill } from './review-pill';
