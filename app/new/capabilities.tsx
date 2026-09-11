'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { InquiryForm } from '@/components/inquiry-form';

const studies: {
  name: string;
  category: string;
  gradient: 'emerald' | 'violet' | 'amber';
  description: string;
}[] = [
  {
    name: 'A considered website.',
    category: 'Website · Design & development',
    gradient: 'emerald',
    description:
      'A closer look at shaping a clear, distinctive home for a business online.',
  },
  {
    name: 'An idea, made usable.',
    category: 'SaaS · Product & engineering',
    gradient: 'violet',
    description:
      'Walk through the decisions that turn an early product idea into a usable experience.',
  },
  {
    name: 'A better way to work.',
    category: 'Web app · Workflow & data',
    gradient: 'amber',
    description:
      'Explore how a custom application can bring scattered workflows into one place.',
  },
];

export function Capabilities() {
  const [selected, setSelected] = useState<(typeof studies)[number] | null>(
    null,
  );
  const dialog = useRef<HTMLDialogElement>(null);
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  useEffect(() => {
    if (!selected) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);

  function close() {
    dialog.current?.close();
    setSelected(null);
  }

  return (
    <section id="docs" className="w-full scroll-mt-24 px-4 py-24 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="inline-flex rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              Case studies
            </span>
            <h2 className="mt-5 max-w-xl text-balance font-serif text-3xl leading-tight text-foreground sm:text-4xl">
              Good ideas.
              <br />
              Thoughtfully built.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">
            Three concept studies. Request a walkthrough to explore the thinking
            behind one, and what it could mean for your project.
          </p>
        </div>
        <div className="case-study-grid mt-10">
          {studies.map((study, index) => (
            <button
              key={study.gradient}
              type="button"
              className={`case-study-card case-${study.gradient}`}
              onClick={() => setSelected(study)}
              aria-label={`Discuss case study: ${study.name}`}
              aria-haspopup="dialog"
            >
              <span className="case-art" aria-hidden="true" />
              <span className="case-study-top">
                <span>CONCEPT STUDY / 0{index + 1}</span>
                <ArrowUpRight size={20} />
              </span>
              <span className="case-study-copy">
                <span className="case-category">{study.category}</span>
                <span className="case-title">{study.name}</span>
                <span className="case-cta">
                  Let’s walk through it <ArrowUpRight size={16} />
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <dialog
        ref={dialog}
        className="case-dialog"
        aria-labelledby="case-dialog-title"
        aria-describedby="case-dialog-description"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div className="case-dialog-inner">
            <button
              type="button"
              className="case-close"
              aria-label="Close case study"
              onClick={close}
              autoFocus
            >
              <X size={20} />
            </button>
            <div
              className={`case-dialog-art case-${selected.gradient}`}
              aria-hidden="true"
            >
              <span className="case-art" />
            </div>
            <div className="case-dialog-copy">
              <p className="case-category">
                Concept case study · Private walkthrough
              </p>
              <h2 id="case-dialog-title" className="mt-4 font-serif text-3xl">
                Let’s look a little closer.
              </h2>
              <p className="mt-4 font-medium">{selected.name}</p>
              <p
                id="case-dialog-description"
                className="mt-2 text-sm leading-6 text-muted-foreground"
              >
                {selected.description} We’ll talk through the approach, answer
                your questions, and explore your own project.
              </p>
              {bookingUrl && (
                <a
                  className="case-book"
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a call <ArrowUpRight size={16} />
                </a>
              )}
              <h3 className="mt-6 font-medium">Request a walkthrough</h3>
              <InquiryForm caseStudy={selected.gradient} />
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
