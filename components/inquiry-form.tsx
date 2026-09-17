'use client';

import Link from 'next/link';
import { Check, Globe2, Layers3, PanelsTopLeft, Sparkles } from 'lucide-react';
import { useEffect, useId, useRef, useState, type SyntheticEvent } from 'react';
import './inquiry-form.css';

type Study = 'emerald' | 'violet' | 'amber';
type Result =
  | { kind: 'idle' }
  | { kind: 'pending' }
  | { kind: 'error'; message: string }
  | { kind: 'success'; reference: string };

const projectTypes = [
  {
    value: 'website',
    label: 'Website',
    detail: 'A place for your brand',
    icon: Globe2,
  },
  {
    value: 'saas',
    label: 'SaaS product',
    detail: 'An idea people use',
    icon: Layers3,
  },
  {
    value: 'web-app',
    label: 'Web app',
    detail: 'A better way to work',
    icon: PanelsTopLeft,
  },
  {
    value: 'other',
    label: 'Let’s explore',
    detail: 'We can figure it out',
    icon: Sparkles,
  },
];

function ProjectRange({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: readonly [string, string, ...string[]];
}) {
  const id = useId();
  const [position, setPosition] = useState(0);
  const index = Math.round(position);
  const lastIndex = options.length - 1;
  const value = options[index] ?? options[0];
  return (
    <div className="inquiry-range-card">
      <div className="inquiry-range-heading">
        <label htmlFor={id}>{label}</label>
        <span>Optional</span>
      </div>
      <output className="inquiry-range-values" htmlFor={id} aria-live="off">
        {options.map((option, optionIndex) => (
          <span
            key={option}
            data-active={optionIndex === index}
            aria-hidden={optionIndex !== index}
          >
            {option}
          </span>
        ))}
      </output>
      <input
        id={id}
        type="range"
        min={0}
        max={lastIndex}
        step={0.001}
        value={position}
        aria-valuetext={value}
        style={{
          backgroundSize: `${(position / lastIndex) * 100}% 4px, 100% 4px`,
        }}
        onChange={(event) => setPosition(Number(event.target.value))}
        onKeyDown={(event) => {
          let nextIndex: number;
          switch (event.key) {
            case 'ArrowRight':
            case 'ArrowUp':
              nextIndex = Math.min(lastIndex, index + 1);
              break;
            case 'ArrowLeft':
            case 'ArrowDown':
              nextIndex = Math.max(0, index - 1);
              break;
            case 'Home':
              nextIndex = 0;
              break;
            case 'End':
              nextIndex = lastIndex;
              break;
            default:
              return;
          }
          event.preventDefault();
          setPosition(nextIndex);
        }}
      />
      <div className="inquiry-range-ticks" aria-hidden="true">
        {options.map((option, optionIndex) => (
          <span key={option} data-active={optionIndex <= index} />
        ))}
      </div>
      <input type="hidden" name={name} value={index === 0 ? '' : value} />
      <div className="inquiry-range-scale" aria-hidden="true">
        <span>Not sure yet</span>
        <span>{options[options.length - 1]}</span>
      </div>
    </div>
  );
}

export function InquiryForm({ caseStudy }: { caseStudy?: Study }) {
  const id = useId();
  const submissionId = useRef<string | null>(null);
  const [result, setResult] = useState<Result>({ kind: 'idle' });
  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (result.kind === 'pending') return;
    const form = new FormData(event.currentTarget);
    if (form.getAll('service').length === 0) {
      setResult({
        kind: 'error',
        message: 'Select at least one project type.',
      });
      event.currentTarget
        .querySelector<HTMLInputElement>('input[name="service"]')
        ?.focus();
      return;
    }
    submissionId.current ??= crypto.randomUUID();
    setResult({ kind: 'pending' });
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: submissionId.current,
          name: form.get('name'),
          email: form.get('email'),
          company: form.get('company'),
          service: form.getAll('service'),
          description: form.get('description'),
          budget: form.get('budget'),
          timeline: form.get('timeline'),
          website: form.get('website'),
          consent: form.get('consent') === 'on',
          caseStudy,
        }),
      });
      const body: unknown = await response.json();
      if (
        response.ok &&
        typeof body === 'object' &&
        body !== null &&
        'ok' in body &&
        body.ok === true &&
        'reference' in body &&
        typeof body.reference === 'string'
      ) {
        setResult({ kind: 'success', reference: body.reference });
        submissionId.current = null;
      } else {
        const message =
          typeof body === 'object' &&
          body !== null &&
          'error' in body &&
          typeof body.error === 'string'
            ? body.error
            : 'Your request could not be saved. Please try again.';
        setResult({ kind: 'error', message });
      }
    } catch {
      setResult({
        kind: 'error',
        message:
          'We could not confirm your request was saved. Please check your connection and try again.',
      });
    }
  }
  if (result.kind === 'success')
    return (
      <div className="inquiry-success" aria-live="polite">
        <h3>Request received.</h3>
        <p>
          Your project details have been saved for Jonas to review. You will not
          receive an automated email.
        </p>
        <p className="inquiry-note">Reference: {result.reference}</p>
      </div>
    );
  return (
    <form className="inquiry-form" onSubmit={submit}>
      <p className="inquiry-note">
        A little context goes a long way. Tell me what you have in mind.
      </p>
      <fieldset disabled={result.kind === 'pending'}>
        <div className="inquiry-grid">
          <label htmlFor={`${id}-name`}>
            Your name *
            <input
              id={`${id}-name`}
              name="name"
              placeholder="Alex Morgan"
              autoComplete="name"
              required
              maxLength={120}
            />
          </label>
          <label htmlFor={`${id}-email`}>
            Email address *
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              placeholder="alex@company.com"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
        </div>
        <label htmlFor={`${id}-company`}>
          <span>
            Company <span className="inquiry-optional">Optional</span>
          </span>
          <input
            id={`${id}-company`}
            name="company"
            autoComplete="organization"
            maxLength={160}
            placeholder="Your company or team"
          />
        </label>
        <fieldset className="inquiry-project-types">
          <legend>
            What are we creating? *{' '}
            <span className="inquiry-optional">Select all that apply</span>
          </legend>
          <div className="inquiry-project-grid">
            {projectTypes.map((project) => (
              <label
                className="inquiry-project"
                data-service={project.value}
                key={project.value}
              >
                <input
                  type="checkbox"
                  name="service"
                  value={project.value}
                  defaultChecked={
                    project.value ===
                    (caseStudy === 'emerald'
                      ? 'website'
                      : caseStudy === 'violet'
                        ? 'saas'
                        : caseStudy === 'amber'
                          ? 'web-app'
                          : 'other')
                  }
                />
                <span className="inquiry-project-icon" aria-hidden="true">
                  <project.icon
                    className="inquiry-project-glyph"
                    size={20}
                    strokeWidth={1.6}
                  />
                  <Check
                    className="inquiry-project-check"
                    size={20}
                    strokeWidth={1.8}
                  />
                </span>
                <span className="inquiry-project-name">{project.label}</span>
                <span className="inquiry-project-detail">{project.detail}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label htmlFor={`${id}-description`}>
          What would you like to build? *
          <textarea
            id={`${id}-description`}
            name="description"
            required
            minLength={20}
            maxLength={5000}
            rows={3}
            placeholder="The idea, the people it’s for, and what you’d love it to do…"
          />
        </label>
        <div className="inquiry-grid inquiry-ranges">
          <ProjectRange
            name="budget"
            label="Project budget"
            options={[
              'Let’s work it out',
              'Under $2,500',
              '$2,500–$5,000',
              '$5,000–$10,000',
              '$10,000–$25,000',
              '$25,000–$50,000',
              '$50,000+',
            ]}
          />
          <ProjectRange
            name="timeline"
            label="Launch Date"
            options={[
              'I’m flexible',
              'Less than 2 weeks',
              'Within a month',
              '1–3 months',
              '3–6 months',
              '6+ months',
            ]}
          />
        </div>
        <div className="inquiry-honeypot" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label className="inquiry-consent">
          <input type="checkbox" name="consent" required />{' '}
          <span>
            I agree that Jonas can store these details to review and respond to
            my request.{' '}
            <Link href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy information
            </Link>
            .
          </span>
        </label>
        <button className="inquiry-submit" type="submit">
          {result.kind === 'pending'
            ? 'Saving request…'
            : 'Send project request'}
          <span aria-hidden="true">↗</span>
        </button>
      </fieldset>
      {result.kind === 'error' && (
        <p className="inquiry-error" role="alert">
          {result.message}
        </p>
      )}
    </form>
  );
}

export function InquiryButton() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <>
      <button className="new-button primary" onClick={() => setOpen(true)}>
        Start your project <span aria-hidden="true">↗</span>
      </button>
      <dialog
        ref={dialog}
        className="inquiry-dialog"
        aria-labelledby={id}
        onClose={() => setOpen(false)}
      >
        <button
          className="inquiry-close"
          aria-label="Close request"
          onClick={() => dialog.current?.close()}
        >
          ×
        </button>
        <h2 id={id}>Let&apos;s talk about your idea.</h2>
        <InquiryForm />
      </dialog>
    </>
  );
}
