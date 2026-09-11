import Link from 'next/link';
import { ThemeButton } from './interactions';
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
            <div className="mt-6">
              <ThemeButton />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="flex flex-col">
              <p className="font-medium text-foreground text-sm">
                {'Services'}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <a
                    href="#product"
                    className="inline-flex w-fit items-center text-muted-foreground text-sm outline-none transition-[opacity,filter,color] duration-300 ease-out hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4"
                  >
                    {'Websites & apps'}
                  </a>
                </li>
                <li>
                  <a
                    href="#planning"
                    className="inline-flex w-fit items-center text-muted-foreground text-sm outline-none transition-[opacity,filter,color] duration-300 ease-out hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4"
                  >
                    {'Project planning'}
                  </a>
                </li>
                <li>
                  <a
                    href="#security"
                    className="inline-flex w-fit items-center text-muted-foreground text-sm outline-none transition-[opacity,filter,color] duration-300 ease-out hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4"
                  >
                    {'Process'}
                  </a>
                </li>
                <li>
                  <a
                    href="#security"
                    className="inline-flex w-fit items-center text-muted-foreground text-sm outline-none transition-[opacity,filter,color] duration-300 ease-out hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4"
                  >
                    {'About Jonas'}
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-foreground text-sm">{'Explore'}</p>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <a
                    href="#docs"
                    className="inline-flex w-fit items-center text-muted-foreground text-sm outline-none transition-[opacity,filter,color] duration-300 ease-out hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4"
                  >
                    {'Case studies'}
                  </a>
                </li>
                <li>
                  <a
                    href="#ecosystem"
                    className="inline-flex w-fit items-center text-muted-foreground text-sm outline-none transition-[opacity,filter,color] duration-300 ease-out hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4"
                  >
                    {'Technology'}
                  </a>
                </li>
                <li>
                  <a
                    href="#planning"
                    className="inline-flex w-fit items-center text-muted-foreground text-sm outline-none transition-[opacity,filter,color] duration-300 ease-out hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4"
                  >
                    {'Planning'}
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-foreground text-sm">{'Jonas'}</p>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <a
                    href="#security"
                    className="inline-flex w-fit items-center text-muted-foreground text-sm outline-none transition-[opacity,filter,color] duration-300 ease-out hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4"
                  >
                    {'About Jonas'}
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="inline-flex w-fit items-center text-muted-foreground text-sm outline-none transition-[opacity,filter,color] duration-300 ease-out hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4"
                  >
                    {'Work together'}
                  </a>
                </li>
                <li>
                  <a
                    href="#docs"
                    className="inline-flex w-fit items-center text-muted-foreground text-sm outline-none transition-[opacity,filter,color] duration-300 ease-out hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4"
                  >
                    {'Case studies'}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 text-sm text-muted-foreground">
          <Link href="/privacy" className="underline underline-offset-4">
            Privacy
          </Link>
        </p>
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
