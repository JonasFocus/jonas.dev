import Image from 'next/image';

const stack = [
  ['Next.js', 'nextjs'],
  ['React', 'react'],
  ['TypeScript', 'typescript'],
  ['Tailwind', 'tailwindcss'],
  ['Node.js', 'nodejs'],
  ['PostgreSQL', 'postgresql'],
  ['Vercel', 'vercel'],
  ['GitHub', 'github'],
] as const;

export function Technology() {
  return (
    <div id="technology" className="scroll-mt-24">
      <section className="w-full px-4 py-16 sm:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-balance font-serif text-2xl text-foreground leading-tight sm:text-3xl">
              {'Connected to the tools you already use'}
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground text-sm leading-7">
              {
                'A practical stack for your website, your product, and what comes next.'
              }
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 overflow-hidden rounded-2xl border border-border/60 sm:grid-cols-4">
            {stack.map(([name, logo]) => (
              <div
                key={name}
                className="group -mt-px -ml-px relative flex h-[5.5rem] items-center justify-center overflow-hidden border-border/60 border-t border-l transition-colors hover:bg-muted/40"
              >
                <span className="flex items-center gap-2.5 text-muted-foreground transition-colors group-hover:text-foreground">
                  <Image
                    width={24}
                    height={24}
                    src={`/new/${logo}.svg`}
                    alt=""
                    aria-hidden="true"
                    className="size-6 rounded-full object-contain"
                  />
                  <span className="font-semibold text-lg tracking-tight">
                    {name}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
