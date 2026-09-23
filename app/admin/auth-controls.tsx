'use client';

import { useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase/browser';

export function SignOut() {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  async function signOut() {
    setPending(true);
    try {
      const { error } = await createBrowserSupabase().auth.signOut({
        scope: 'local',
      });
      if (error) throw error;
      window.location.assign('/admin/login');
    } catch {
      setError('Could not sign out. You are still signed in. Try again.');
      setPending(false);
    }
  }
  return (
    <>
      <button
        className="cx-signout"
        type="button"
        onClick={signOut}
        disabled={pending}
        aria-label="Sign out"
        title="Sign out"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      </button>
      {error && (
        <p role="alert" className="cx-error">
          {error}
        </p>
      )}
    </>
  );
}

export function LoginForm() {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  async function signIn(data?: FormData) {
    setPending(true);
    setError('');
    try {
      const supabase = createBrowserSupabase();
      const email = data?.get('email');
      const password = data?.get('password');
      const result = data
        ? await supabase.auth.signInWithPassword({
            email: typeof email === 'string' ? email : '',
            password: typeof password === 'string' ? password : '',
          })
        : await supabase.auth.signInWithPasskey();
      if (result.error) {
        setError(
          data
            ? 'Could not sign in. Check your email and password.'
            : 'Passkey sign-in did not complete. Try again or use your owner password.',
        );
        return;
      }
      const response = await fetch('/api/admin/session', { method: 'POST' });
      if (!response.ok) {
        await supabase.auth.signOut({ scope: 'local' });
        setError('This account cannot access the workspace.');
        return;
      }
      window.location.assign('/admin');
    } catch {
      setError('Sign-in is temporarily unavailable. Please try again.');
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="cx-login-actions">
      <button
        className="cs-button"
        type="button"
        data-primary
        disabled={pending}
        onClick={() => void signIn()}
      >
        {pending ? 'Signing in…' : 'Sign in with a passkey'}
      </button>
      <details>
        <summary>Use owner password</summary>
        <form action={signIn} className="cs-form">
          <fieldset disabled={pending}>
            <label className="cs-field">
              <span>Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="username"
              />
            </label>
            <label className="cs-field">
              <span>Password</span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </label>
            <div className="cs-form-foot">
              <button className="cs-button" type="submit">
                {pending ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </fieldset>
        </form>
      </details>
      {error && (
        <p className="cx-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function PasskeySettings() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  async function register() {
    setPending(true);
    setError('');
    setMessage('');
    try {
      const { error } = await createBrowserSupabase().auth.registerPasskey();
      if (error) throw error;
      setMessage('Passkey added. You can use this device to sign in.');
    } catch {
      setError(
        'Could not add a passkey. Make sure passkeys are enabled and try again.',
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="cs-form-foot">
      <button
        className="cs-button"
        type="button"
        onClick={register}
        disabled={pending}
      >
        {pending ? 'Waiting for your device…' : 'Add a passkey'}
      </button>
      <span className="cs-feedback" aria-live="polite">
        {error && (
          <span role="alert" className="cx-bad">
            {error}
          </span>
        )}
        {message && <span className="cx-ok">{message}</span>}
      </span>
    </div>
  );
}
