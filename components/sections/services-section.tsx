'use client';

import { Check } from 'lucide-react';

import './services-section.css';

const services = [
  {
    name: 'Website',
    description: 'FOR YOUR NEXT CHAPTER ONLINE',
    category: 'A website.',
    qualifier: 'built for your business',
    badge: 'YOUR FRONT DOOR',
    featured: false,
    copy: 'For a business that needs a first website, a fresh start, or a better way for customers to get in touch.',
    includes: [
      'Custom design for desktop and mobile',
      'Fast pages and search engine essentials',
      'Contact forms and useful integrations',
      'Domain setup, launch, and handover',
      'Updates when you need them*',
    ],
  },
  {
    name: 'Web application',
    description: 'FOR THE WAY YOUR BUSINESS WORKS',
    category: 'A web app.',
    qualifier: 'built around your workflow',
    badge: 'BUILT AROUND YOU',
    featured: true,
    copy: 'For a product you want to launch, a customer portal, or an internal tool that makes everyday work easier.',
    includes: [
      'Product planning and interface design',
      'Accounts, data, and custom workflows',
      'Payments and integrations where needed',
      'Testing, launch, and source code handover',
      'Updates when you need them*',
    ],
  },
];

export function ServicesSection({
  onStartProject,
}: {
  onStartProject: () => void;
}) {
  return (
    <section
      className="offer-section"
      id="services"
      aria-labelledby="offer-heading"
    >
      <div className="offer-heading">
        <p className="offer-eyebrow">WAYS TO WORK TOGETHER</p>
        <h2 id="offer-heading">What do you have in mind?</h2>
        <p className="offer-introduction">
          Help customers find you, or give them something useful to use.
        </p>
      </div>

      <div className="offer-grid">
        {services.map((service) => (
          <article
            className={`offer-card${service.featured ? ' offer-card-featured' : ''}`}
            key={service.name}
          >
            <div className="offer-card-top">
              <div className="offer-card-labels">
                <h3>{service.name}</h3>
                <span className="offer-badge">{service.badge}</span>
              </div>
              <p className="offer-kicker">{service.description}</p>

              <div className="offer-category">
                <span>{service.category}</span>
                <span className="offer-category-caption">
                  {service.qualifier}
                </span>
              </div>
              <p className="offer-description">{service.copy}</p>

              <button
                className="offer-button"
                type="button"
                onClick={onStartProject}
              >
                Start a project
              </button>
              <p className="offer-card-note">
                A clear scope and proposal before work begins.
              </p>
            </div>

            <ul
              className="offer-feature-list"
              aria-label={`${service.name} includes`}
            >
              {service.includes.map((feature) => (
                <li key={feature}>
                  <span className="offer-check" aria-hidden="true">
                    <Check size={16} strokeWidth={1.6} />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="offer-footnote">* Scope and updates agreed per project.</p>
    </section>
  );
}
