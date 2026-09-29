import Link from 'next/link';

const linkClass =
  'inline-flex w-fit items-center text-muted-foreground text-sm outline-none transition-[opacity,filter,color] duration-300 ease-out hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4';

const columns = [
  [
    'Services',
    [
      ['Websites & apps', '#services'],
      ['Project planning', '#planning'],
      ['What you own', '#handover'],
    ],
  ],
  [
    'Explore',
    [
      ['Plans', '#pricing'],
      ['Technology', '#technology'],
      ['Questions', '#faq'],
    ],
  ],
  [
    'Jonas',
    [
      ['Work together', '#contact'],
      ['Privacy', '/privacy'],
    ],
  ],
] as const;

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 pt-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="flex flex-col">
            <span className="font-pixel text-foreground text-xl">
              {'Jonas'}
            </span>
            <p className="mt-3 max-w-xs text-pretty text-muted-foreground text-sm leading-6">
              {
                'Independent design and development for websites, SaaS products, and custom web applications.'
              }
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map(([title, links]) => (
              <div key={title} className="flex flex-col">
                <p className="font-medium text-foreground text-sm">{title}</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {links.map(([label, href]) => (
                    <li key={label}>
                      {href.startsWith('/') ? (
                        <Link href={href} className={linkClass}>
                          {label}
                        </Link>
                      ) : (
                        <a href={href} className={linkClass}>
                          {label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="relative mt-16 h-[10vw] select-none overflow-hidden">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 block translate-y-1/3 whitespace-nowrap text-center font-pixel text-[18vw] text-transparent leading-[0.9]"
            style={{
              WebkitTextStroke:
                '1px color-mix(in oklch, var(--foreground) 22%, transparent)',
            }}
          >
            {'Jonas'}
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 block translate-y-1/3 whitespace-nowrap text-center font-pixel text-[18vw] text-foreground/10 leading-[0.9]"
          >
            {'Jonas'}
          </span>
          <span className="sr-only">{'Jonas'}</span>
        </div>
      </div>
    </footer>
  );
}
