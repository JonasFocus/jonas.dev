import Link from 'next/link';
import { LoginForm } from '../auth-controls';
export default function Login() {
  return (
    <main className="cx-login">
      <section className="cx-hero">
        <div className="cx-hero-art cx-art" aria-hidden="true">
          <div className="cx-dither" />
        </div>
        <div className="cx-hero-body">
          <p className="cx-login-brand">
            <span className="cx-mark" aria-hidden="true">
              J
            </span>
            Console
          </p>
          <h1 className="cx-hero-title">Sign in to the console</h1>
          <p className="cx-hero-sub">
            Requests, customers and your next steps. Access is limited to the
            website owner.
          </p>
          <LoginForm />
        </div>
      </section>
      <p className="cx-login-foot">
        <Link className="cs-quiet-link" href="/">
          ← Back to website
        </Link>
      </p>
    </main>
  );
}
