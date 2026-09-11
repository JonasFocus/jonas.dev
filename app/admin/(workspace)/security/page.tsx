import { Heading } from '../../shared';
import { PasskeySettings } from '../../auth-controls';
export default function Security() {
  return (
    <>
      <Heading
        title="Security"
        subtitle="Manage how you access your private workspace."
      />
      <section className="admin-panel admin-padded admin-narrow">
        <h2>Passkeys</h2>
        <p className="admin-muted">
          Use your fingerprint, face or device PIN to sign in. Keep your owner
          password in a password manager as a backup. No sign-in emails are
          sent.
        </p>
        <PasskeySettings />
      </section>
    </>
  );
}
