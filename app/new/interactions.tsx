'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ChevronDown, Hexagon, Menu, Moon, Sun, X } from 'lucide-react';
import questions from './faq-data.json';
import { InquiryButton } from '@/components/inquiry-form';

const ThemeContext = createContext({ dark: true, toggle: () => {} });
export function PageShell({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('entered');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.06 },
    );
    root.querySelectorAll('main > section, main > div').forEach((el) => {
      el.classList.add('new-reveal');
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <ThemeContext.Provider
      value={{ dark, toggle: () => setDark((value) => !value) }}
    >
      <div
        id="top"
        ref={ref}
        data-theme={dark ? 'dark' : 'light'}
        className="meridian-page"
      >
        <div className="flex min-h-screen w-full flex-col bg-background">
          {children}
        </div>
      </div>
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
    ['Websites', 'A clear home for your business online', '#product'],
    ['SaaS products', 'Your idea, designed and built for real use', '#product'],
    ['Custom web apps', 'A better way to get your daily work done', '#product'],
  ],
  Explore: [
    ['How we work', 'Working together, from first sketch to launch', '#security'],
    ['Technology', 'A practical stack for your product', '#ecosystem'],
    ['Common questions', 'A few things to know before we begin', '#support'],
  ],
};
export function Header() {
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
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
        setMobile(false);
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
              Planning
            </a>
            <a className="nav-link" href="#security">
              About
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a className="new-button ghost hidden sm:inline-flex" href="#docs">
              See our work
            </a>
            <a
              className="new-button primary hidden sm:inline-flex"
              href="#newsletter"
            >
              Newsletter
            </a>
            <button
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
          <div className="mobile-dropdown lg:hidden">
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
              Planning
            </a>
            <a
              className="nav-link"
              href="#security"
              onClick={() => setMobile(false)}
            >
              About Jonas
            </a>
            <a
              className="new-button primary"
              href="#newsletter"
              onClick={() => setMobile(false)}
            >
              Newsletter
            </a>
          </div>
        )}
      </header>
    </section>
  );
}
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="support" className="w-full scroll-mt-24 px-4 py-24 sm:px-8">
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
                hidden={open !== index}
                className="faq-answer-new"
              >
                {answer}
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
