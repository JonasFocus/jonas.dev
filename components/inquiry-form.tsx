'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState, type SyntheticEvent } from 'react';
import './inquiry-form.css';

type Study = 'emerald' | 'violet' | 'amber';
type Result =
  | { kind: 'idle' }
  | { kind: 'pending' }
  | { kind: 'error'; message: string }
  | { kind: 'success'; reference: string };

export function InquiryForm({ caseStudy }: { caseStudy?: Study }) {
  const id = useId();
  const submissionId = useRef<string | null>(null);
  const [result, setResult] = useState<Result>({ kind: 'idle' });
  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (result.kind === 'pending') return;
    const form = new FormData(event.currentTarget);
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
          service: form.get('service'),
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
        Tell me a little about your project. Required fields are marked *.
      </p>
      <fieldset disabled={result.kind === 'pending'}>
        <div className="inquiry-grid">
          <label htmlFor={`${id}-name`}>
            Name *
            <input
              id={`${id}-name`}
              name="name"
              autoComplete="name"
              required
              maxLength={120}
            />
          </label>
          <label htmlFor={`${id}-email`}>
            Email *
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
          <label htmlFor={`${id}-company`}>
            Company
            <input
              id={`${id}-company`}
              name="company"
              autoComplete="organization"
              maxLength={160}
            />
          </label>
          <label htmlFor={`${id}-service`}>
            Project type *
            <select
              id={`${id}-service`}
              name="service"
              defaultValue={
                caseStudy === 'emerald'
                  ? 'website'
                  : caseStudy === 'violet'
                    ? 'saas'
                    : caseStudy === 'amber'
                      ? 'web-app'
                      : 'other'
              }
            >
              <option value="website">Website</option>
              <option value="saas">SaaS product</option>
              <option value="web-app">Custom web app</option>
              <option value="other">Let&apos;s work it out</option>
            </select>
          </label>
        </div>
        <label htmlFor={`${id}-description`}>
          What would you like to build? *
          <textarea
            id={`${id}-description`}
            name="description"
            required
            minLength={20}
            maxLength={5000}
            rows={4}
          />
        </label>
        <div className="inquiry-grid">
          <label htmlFor={`${id}-budget`}>
            Budget, if known
            <input
              id={`${id}-budget`}
              name="budget"
              maxLength={120}
              placeholder="A range is fine"
            />
          </label>
          <label htmlFor={`${id}-timeline`}>
            Timing, if known
            <input
              id={`${id}-timeline`}
              name="timeline"
              maxLength={120}
              placeholder="When would you like to launch?"
            />
          </label>
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
        <button className="case-book" type="submit">
          {result.kind === 'pending' ? 'Saving request…' : 'Send request'}
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
        {open && <InquiryForm />}
      </dialog>
    </>
  );
}
