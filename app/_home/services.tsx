import { Check } from 'lucide-react';
import { SourceGradient } from './source-gradient';

const handover = [
  ['Domain', 'yourbusiness.com'],
  ['Code', 'GitHub repository'],
  ['Hosting', 'Vercel'],
  ['Payments', 'Stripe'],
  ['Data', 'Database, files'],
  ['Docs', 'Setup guide'],
] as const;

export function Services() {
  return (
    <div id="product" className="scroll-mt-24">
      <section className="w-full px-4 py-20 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <span className="inline-flex items-center rounded-full border border-border/60 bg-card px-3 py-1 font-medium text-muted-foreground text-xs">
            {'Why work with Jonas'}
          </span>
          <h2 className="block mt-5 text-balance font-serif text-3xl text-foreground leading-[1.05] sm:text-5xl">
            {'When we’re done, it’s all yours.'}
          </h2>
          <div className="relative mt-12 overflow-hidden rounded-2xl px-4 py-16 sm:px-8">
            <SourceGradient variant={0} />
            <div className="relative mx-auto max-w-xl rounded-[1.4rem] border border-border/70 bg-background/90 p-6 text-foreground shadow-[0_24px_64px_-40px_color-mix(in_oklch,var(--foreground)_40%,transparent)] backdrop-blur-xl sm:p-7">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-medium text-base">{'Handover'}</h3>
                <span className="text-muted-foreground text-xs">
                  {'Everything in your name'}
                </span>
              </div>
              <ul className="mt-5 border-border border-t">
                {handover.map(([label, item]) => (
                  <li
                    key={label}
                    className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 border-border border-b py-3.5 text-sm"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="truncate font-mono text-[0.8rem]">
                      {item}
                    </span>
                    <Check
                      className="size-4 text-success"
                      aria-label="Yours"
                    />
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-pretty text-muted-foreground text-sm leading-6">
                {
                  'Run it, move it, or take it to another developer. Nothing is locked to me.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
