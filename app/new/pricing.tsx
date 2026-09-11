import { Check } from 'lucide-react';

const monthly = [
  'We build your website',
  'We keep it online',
  'One change each month',
  'The website stays yours if you leave',
];

const enterprise = [
  'A full website, built for you',
  'Extra tools: bookings, payments, staff logins',
  'We write the plan before we start',
  'You own it when we are done',
];

export function Pricing() {
  return (
    <section
      className="pricing-section"
      id="pricing"
      aria-labelledby="pricing-title"
    >
      <div className="pricing-intro">
        <span className="pricing-kicker">Prices</span>
        <h2 id="pricing-title">Two ways to get a website.</h2>
        <p>Pay a little each month, or have us build the whole thing.</p>
      </div>

      <div className="pricing-pair">
        <article className="pricing-pane is-monthly">
          <h3>Monthly</h3>
          <p className="pricing-blurb">
            We build your site. Then $297 each month to keep it running.
          </p>
          <p className="pricing-price">
            <span>$297</span>
            <small>a month</small>
          </p>
          <p className="pricing-setup">
            Plus <strong>$499</strong> once, to set it up.
          </p>
          <p className="pricing-note">
            Pay 4 months now ($1,188) and get 6 months of hosting ($1,782
            value).
          </p>
          <a className="pricing-cta" href="#contact">
            Get a website
          </a>
          <ul className="pricing-includes">
            {monthly.map((item) => (
              <li key={item}>
                <Check size={14} strokeWidth={1.75} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="pricing-pane is-enterprise">
          <h3>Full project</h3>
          <p className="pricing-blurb">
            A complete website, plus the extra systems your business needs.
          </p>
          <p className="pricing-price">
            <span>Custom</span>
            <small>priced with you</small>
          </p>
          <p className="pricing-setup">Usually $15,000 and up.</p>
          <p className="pricing-note">
            Bookings, payments, staff tools. You own everything.
          </p>
          <a className="pricing-cta" href="#contact">
            Talk about a full build
          </a>
          <ul className="pricing-includes">
            {enterprise.map((item) => (
              <li key={item}>
                <Check size={14} strokeWidth={1.75} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
