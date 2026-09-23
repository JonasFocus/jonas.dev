import { Hero } from '../../shared';
import { PasskeySettings } from '../../auth-controls';
export default function Security() {
  return (
    <>
      <Hero
        tone="cool"
        title="Security"
        subtitle="Manage how you access your private workspace."
      />
      <h2 className="cx-label">Passkeys</h2>
      <p className="cs-hint">
        Use your fingerprint, face or device PIN to sign in. Keep your owner
        password in a password manager as a backup. No sign-in emails are sent.
      </p>
      <div className="cs-panel">
        <PasskeySettings />
      </div>
    </>
  );
}
