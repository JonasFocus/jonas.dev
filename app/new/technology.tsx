import Image from 'next/image';
export function Technology() {
  return (
    <div id="ecosystem" className="scroll-mt-24">
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
            <div className="group -mt-px -ml-px relative flex h-[5.5rem] items-center justify-center overflow-hidden border-border/60 border-t border-l transition-colors hover:bg-muted/40">
              <span
                className="flex items-center gap-2.5 text-muted-foreground/75 transition-colors group-hover:text-foreground"
                style={{ opacity: '1', transform: 'none' }}
              >
                <Image
                  width={24}
                  height={24}
                  src="/new/nextjs.svg"
                  alt=""
                  aria-hidden="true"
                  className="size-6 rounded-full object-contain"
                />
                <span className="font-semibold text-lg tracking-tight">
                  {'Next.js'}
                </span>
              </span>
            </div>
            <div className="group -mt-px -ml-px relative flex h-[5.5rem] items-center justify-center overflow-hidden border-border/60 border-t border-l transition-colors hover:bg-muted/40">
              <span
                className="flex items-center gap-2.5 text-muted-foreground/75 transition-colors group-hover:text-foreground"
                style={{ opacity: '1', transform: 'none' }}
              >
                <Image
                  width={24}
                  height={24}
                  src="/new/react.svg"
                  alt=""
                  aria-hidden="true"
                  className="size-6 rounded-full object-contain"
                />
                <span className="font-semibold text-lg tracking-tight">
                  {'React'}
                </span>
              </span>
            </div>
            <div className="group -mt-px -ml-px relative flex h-[5.5rem] items-center justify-center overflow-hidden border-border/60 border-t border-l transition-colors hover:bg-muted/40">
              <span
                className="flex items-center gap-2.5 text-muted-foreground/75 transition-colors group-hover:text-foreground"
                style={{ opacity: '1', transform: 'none' }}
              >
                <Image
                  width={24}
                  height={24}
                  src="/new/typescript.svg"
                  alt=""
                  aria-hidden="true"
                  className="size-6 rounded-full object-contain"
                />
                <span className="font-semibold text-lg tracking-tight">
                  {'TypeScript'}
                </span>
              </span>
            </div>
            <div className="group -mt-px -ml-px relative flex h-[5.5rem] items-center justify-center overflow-hidden border-border/60 border-t border-l transition-colors hover:bg-muted/40">
              <span
                className="flex items-center gap-2.5 text-muted-foreground/75 transition-colors group-hover:text-foreground"
                style={{ opacity: '1', transform: 'none' }}
              >
                <Image
                  width={24}
                  height={24}
                  src="/new/tailwindcss.svg"
                  alt=""
                  aria-hidden="true"
                  className="size-6 rounded-full object-contain"
                />
                <span className="font-semibold text-lg tracking-tight">
                  {'Tailwind'}
                </span>
              </span>
            </div>
            <div className="group -mt-px -ml-px relative flex h-[5.5rem] items-center justify-center overflow-hidden border-border/60 border-t border-l transition-colors hover:bg-muted/40">
              <span
                className="flex items-center gap-2.5 text-muted-foreground/75 transition-colors group-hover:text-foreground"
                style={{ opacity: '1', transform: 'none' }}
              >
                <Image
                  width={24}
                  height={24}
                  src="/new/nodejs.svg"
                  alt=""
                  aria-hidden="true"
                  className="size-6 rounded-full object-contain"
                />
                <span className="font-semibold text-lg tracking-tight">
                  {'Node.js'}
                </span>
              </span>
            </div>
            <div className="group -mt-px -ml-px relative flex h-[5.5rem] items-center justify-center overflow-hidden border-border/60 border-t border-l transition-colors hover:bg-muted/40">
              <span
                className="flex items-center gap-2.5 text-muted-foreground/75 transition-colors group-hover:text-foreground"
                style={{ opacity: '1', transform: 'none' }}
              >
                <Image
                  width={24}
                  height={24}
                  src="/new/postgresql.svg"
                  alt=""
                  aria-hidden="true"
                  className="size-6 rounded-full object-contain"
                />
                <span className="font-semibold text-lg tracking-tight">
                  {'PostgreSQL'}
                </span>
              </span>
            </div>
            <div className="group -mt-px -ml-px relative flex h-[5.5rem] items-center justify-center overflow-hidden border-border/60 border-t border-l transition-colors hover:bg-muted/40">
              <span
                className="flex items-center gap-2.5 text-muted-foreground/75 transition-colors group-hover:text-foreground"
                style={{ opacity: '1', transform: 'none' }}
              >
                <Image
                  width={24}
                  height={24}
                  src="/new/vercel.svg"
                  alt=""
                  aria-hidden="true"
                  className="size-6 rounded-full object-contain"
                />
                <span className="font-semibold text-lg tracking-tight">
                  {'Vercel'}
                </span>
              </span>
            </div>
            <div className="group -mt-px -ml-px relative flex h-[5.5rem] items-center justify-center overflow-hidden border-border/60 border-t border-l transition-colors hover:bg-muted/40">
              <span
                className="flex items-center gap-2.5 text-muted-foreground/75 transition-colors group-hover:text-foreground"
                style={{ opacity: '1', transform: 'none' }}
              >
                <Image
                  width={24}
                  height={24}
                  src="/new/github.svg"
                  alt=""
                  aria-hidden="true"
                  className="size-6 rounded-full object-contain"
                />
                <span className="font-semibold text-lg tracking-tight">
                  {'GitHub'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
