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
      setError('Could not sign out. Try again.');
      setPending(false);
    }
  }
  return (
    <div>
      <button
        className="admin-text-button"
        onClick={signOut}
        disabled={pending}
      >
        {pending ? 'Signing out…' : 'Sign out'}
      </button>
      {error && (
        <p role="alert" className="admin-error">
          {error}
        </p>
      )}
    </div>
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
    <div className="admin-stack">
      <button
        className="admin-button"
        disabled={pending}
        onClick={() => void signIn()}
      >
        {pending ? 'Signing in…' : 'Sign in with a passkey'}
      </button>
      <details>
        <summary>Use owner password</summary>
        <form action={signIn} className="admin-form">
          <fieldset disabled={pending}>
            <label>
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="username"
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </label>
            <button className="admin-button" type="submit">
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </fieldset>
        </form>
      </details>
      {error && (
        <p className="admin-error" role="alert">
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
    <div className="admin-form">
      <button className="admin-button" onClick={register} disabled={pending}>
        {pending ? 'Waiting for your device…' : 'Add a passkey'}
      </button>
      <div aria-live="polite">
        {error && (
          <p role="alert" className="admin-error">
            {error}
          </p>
        )}
        {message && <p className="admin-success">{message}</p>}
      </div>
    </div>
  );
}
