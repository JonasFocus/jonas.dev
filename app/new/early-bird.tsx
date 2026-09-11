export function EarlyBird() {
  return (
    <section className="early-bird-section" aria-labelledby="early-bird-title">
      <div className="early-bird-card">
        <div>
          <span className="newsletter-eyebrow">Early-bird offer</span>
          <h2 id="early-bird-title">Pay for 4 months.<br />Get 6 months.</h2>
          <p>Two extra months included when you pay for four upfront.</p>
          <p className="early-bird-details">Service details and pricing coming soon.</p>
        </div>
        <div className="early-bird-bonus">
          <span className="early-bird-number">+2</span>
          <span>months included</span>
          <a href="#newsletter">Newsletter coming soon <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
