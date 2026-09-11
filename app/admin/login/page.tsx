import Link from 'next/link';
import { LoginForm } from '../auth-controls';
export default function Login() {
  return (
    <main className="admin-login">
      <Link href="/" className="admin-brand">
        Jonas<span>Private workspace</span>
      </Link>
      <section className="admin-panel admin-padded">
        <header className="admin-heading">
          <p className="admin-eyebrow">Owner access</p>
          <h1>Welcome back.</h1>
          <p>Requests, customers and your next steps.</p>
        </header>
        <LoginForm />
      </section>
      <p className="admin-muted">Access is limited to the website owner.</p>
      <Link href="/">← Back to website</Link>
    </main>
  );
}
