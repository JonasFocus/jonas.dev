export function Newsletter() {
  return (
    <section className="newsletter-card" id="newsletter" aria-labelledby="newsletter-title">
      <span className="newsletter-eyebrow">The newsletter</span>
      <h2 id="newsletter-title">A little insight for your next big idea.</h2>
      <p>Notes on better websites, building products, and what we learn along the way.</p>
      <div className="newsletter-fields">
        <label className="sr-only" htmlFor="newsletter-email">Email address</label>
        <input id="newsletter-email" type="email" placeholder="Your email address" disabled aria-describedby="newsletter-status" />
        <button type="button" disabled>Join the newsletter <span aria-hidden="true">↗</span></button>
      </div>
      <p className="newsletter-status" id="newsletter-status">Coming soon. Signups aren’t open yet.</p>
    </section>
  );
}
