export function EarlyBird() {
  return (
    <section className="early-bird-section" aria-labelledby="early-bird-title">
      <div className="early-bird-card">
        <div className="early-bird-copy">
          <span className="early-bird-eyebrow">Early-bird offer</span>
          <h2 id="early-bird-title">A little more time, on us.</h2>
          <p>Pay for four months upfront. Get six months in total.</p>
          <p className="early-bird-details">
            Service details and pricing coming soon.
          </p>
        </div>
        <figure
          className="early-bird-timeline"
          aria-label="Six months total: four paid upfront, plus two included at no extra cost."
        >
          <div className="early-bird-months" aria-hidden="true">
            {[1, 2, 3, 4, 5, 6].map((month) => (
              <span
                key={month}
                className={
                  month > 4 ? 'early-bird-month bonus' : 'early-bird-month'
                }
              >
                {String(month).padStart(2, '0')}
              </span>
            ))}
          </div>
          <div className="early-bird-legend" aria-hidden="true">
            <span>4 months upfront</span>
            <span>+2 on us</span>
          </div>
        </figure>
      </div>
    </section>
  );
}
