'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { ChevronDown, Hexagon, Menu, Moon, Sun, X } from 'lucide-react';
import questions from './faq-data.json';
import { InquiryButton } from '@/components/inquiry-form';

const ThemeContext = createContext({ dark: true, toggle: () => {} });

const THEME_KEY = 'theme';

const themeListeners = new Set<() => void>();

function preferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored === 'dark';
  return !window.matchMedia('(prefers-color-scheme: light)').matches;
}

function subscribeTheme(notify: () => void) {
  const query = window.matchMedia('(prefers-color-scheme: light)');
  themeListeners.add(notify);
  query.addEventListener('change', notify);
  return () => {
    themeListeners.delete(notify);
    query.removeEventListener('change', notify);
  };
}

function storeTheme(dark: boolean) {
  localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  for (const notify of themeListeners) notify();
}

// Applies the stored theme before hydration so a light-mode visitor never sees a dark frame.
const themeScript = `(function(){try{var e=document.getElementById('top');if(!e)return;var s=localStorage.getItem('${THEME_KEY}');var d=s?s==='dark':!matchMedia('(prefers-color-scheme: light)').matches;e.setAttribute('data-theme',d?'dark':'light');document.documentElement.classList.toggle('dark',d)}catch(_){}})()`;

export function PageShell({ children }: { children: ReactNode }) {
  const dark = useSyncExternalStore(subscribeTheme, preferredTheme, () => true);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const sections = [
      ...root.querySelectorAll<HTMLElement>('main > section, main > div'),
    ];
    sections.forEach((el) => el.classList.add('new-reveal'));
    let frame = 0;
    function reveal() {
      frame = 0;
      for (const el of sections) {
        const box = el.getBoundingClientRect();
        const margin = Math.min(box.height * 0.06, window.innerHeight * 0.2);
        if (box.top < window.innerHeight - margin && box.bottom > 0) {
          el.classList.add('entered');
        }
      }
    }
    function schedule() {
      frame ||= requestAnimationFrame(reveal);
    }
    reveal();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
  return (
    <ThemeContext.Provider
      value={{
        dark,
        toggle: () => storeTheme(!dark),
      }}
    >
      <div
        id="top"
        ref={ref}
        data-theme={dark ? 'dark' : 'light'}
        className="meridian-page"
        suppressHydrationWarning
      >
        <div className="flex min-h-screen w-full flex-col bg-background">
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          {children}
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
    </ThemeContext.Provider>
  );
}
export function ThemeButton() {
  const { dark, toggle } = useContext(ThemeContext);
  return (
    <button
      className="theme-switch"
      onClick={toggle}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
const menus = {
  Services: [
    ['Websites', 'A clear home for your business online', '#websites'],
    ['SaaS products', 'Your idea, designed and built for real use', '#saas'],
    [
      'Custom web apps',
      'A better way to get your daily work done',
      '#web-apps',
    ],
  ],
  Explore: [
    [
      'How we work',
      'Working together, from first sketch to launch',
      '#planning',
    ],
    ['Technology', 'A practical stack for your product', '#technology'],
    ['What you own', 'Everything ends up in your name', '#handover'],
    ['Common questions', 'A few things to know before we begin', '#faq'],
  ],
};
export function Header({
  newsletterEnabled = false,
}: {
  newsletterEnabled?: boolean;
}) {
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!mobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const menu = menuRef.current;
    menu?.querySelector<HTMLElement>('a, button')?.focus();
    function trap(event: KeyboardEvent) {
      if (event.key !== 'Tab' || !menu) return;
      const stops = [
        toggleRef.current,
        ...menu.querySelectorAll<HTMLElement>('a, button'),
      ].filter((stop): stop is HTMLElement => stop !== null);
      const first = stops[0];
      const last = stops[stops.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', trap);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', trap);
    };
  }, [mobile]);
  useEffect(() => {
    function close(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !ref.current?.contains(event.target)
      ) {
        setActive(null);
        setMobile(false);
      }
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(null);
        setMobile((open) => {
          if (open) toggleRef.current?.focus();
          return false;
        });
      }
    }
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, []);
  function links(name: keyof typeof menus) {
    return (
      <div className="menu-links">
        {menus[name].map(([title, note, href]) => (
          <a
            key={title}
            href={href}
            onClick={() => {
              setActive(null);
              setMobile(false);
            }}
          >
            <strong>{title}</strong>
            <span>{note}</span>
          </a>
        ))}
      </div>
    );
  }
  return (
    <section className="w-full px-4 pt-6 sm:px-8 sticky top-0 z-50">
      <header ref={ref} className="relative mx-auto w-full max-w-5xl">
        <div className="relative flex h-14 items-center justify-between rounded-full border border-border/60 bg-background/50 px-3 backdrop-blur-md sm:px-4">
          <a
            href="#top"
            className="flex shrink-0 items-center gap-2 rounded-lg px-1 font-semibold text-foreground"
          >
            <span className="grid size-7 place-items-center rounded-lg bg-foreground text-background">
              <Hexagon size={16} />
            </span>
            Jonas
          </a>
          <nav
            aria-label="Main navigation"
            className="-translate-x-1/2 absolute left-1/2 hidden items-center gap-1 lg:flex"
          >
            {(['Services', 'Explore'] as const).map((name) => (
              <div key={name} className="relative">
                <button
                  className="nav-link"
                  aria-expanded={active === name}
                  onClick={() => setActive(active === name ? null : name)}
                >
                  {name}
                  <ChevronDown size={14} />
                </button>
                {active === name && (
                  <div className="desktop-dropdown">{links(name)}</div>
                )}
              </div>
            ))}
            <a className="nav-link" href="#pricing">
              Plans
            </a>
            <a className="nav-link" href="#planning">
              Planning
            </a>
            <a className="nav-link" href="#handover">
              What you own
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeButton />
            <a
              className="new-button ghost hidden sm:inline-flex"
              href="#services"
            >
              See our work
            </a>
            {newsletterEnabled && (
              <a
                className="new-button primary hidden sm:inline-flex"
                href="#newsletter"
              >
                Newsletter
              </a>
            )}
            <button
              ref={toggleRef}
              className="grid size-9 place-items-center lg:hidden"
              aria-label={mobile ? 'Close menu' : 'Open menu'}
              aria-expanded={mobile}
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {mobile && (
          <div ref={menuRef} className="mobile-dropdown lg:hidden">
            {(['Services', 'Explore'] as const).map((name) => (
              <div key={name}>
                <button
                  className="nav-link"
                  aria-expanded={active === name}
                  onClick={() => setActive(active === name ? null : name)}
                >
                  {name}
                  <ChevronDown size={16} />
                </button>
                {active === name && links(name)}
              </div>
            ))}
            <a
              className="nav-link"
              href="#pricing"
              onClick={() => setMobile(false)}
            >
              Plans
            </a>
            <a
              className="nav-link"
              href="#planning"
              onClick={() => setMobile(false)}
            >
              Planning
            </a>
            <a
              className="nav-link"
              href="#handover"
              onClick={() => setMobile(false)}
            >
              What you own
            </a>
            {newsletterEnabled && (
              <a
                className="nav-link"
                href="#newsletter"
                onClick={() => setMobile(false)}
              >
                Newsletter
              </a>
            )}
            <InquiryButton onOpen={() => setMobile(false)} />
          </div>
        )}
      </header>
    </section>
  );
}
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="w-full scroll-mt-24 px-4 py-24 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="inline-flex items-center rounded-full border border-border/60 bg-card px-3 py-1 font-medium text-muted-foreground text-xs">
            FAQ
          </span>
          <h2 className="mt-6 font-serif text-3xl text-foreground sm:text-4xl">
            Questions? Answered.
          </h2>
          <p className="mt-6 max-w-sm text-muted-foreground text-base leading-7">
            A few things to know about working together. Have something else in
            mind?{' '}
            <a className="underline underline-offset-4" href="#contact">
              Start a conversation
            </a>
            .
          </p>
        </div>
        <div>
          {questions.map(([question, answer], index) => (
            <div
              className={`faq-entry ${open === index ? 'expanded' : ''}`}
              key={question}
            >
              <button
                aria-expanded={open === index}
                aria-controls={`answer-${index}`}
                onClick={() => setOpen(open === index ? null : index)}
              >
                <span>{question}</span>
                <ChevronDown size={16} />
              </button>
              <div
                id={`answer-${index}`}
                inert={open !== index}
                className="faq-panel"
              >
                <div className="faq-answer-new">
                  <p>{answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Contact() {
  return (
    <div className="contact-inline">
      <InquiryButton />
    </div>
  );
}
