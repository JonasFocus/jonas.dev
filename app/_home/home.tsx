import { preload } from 'react-dom';
import { getNewsletterEnabled } from '@/lib/homepage-settings';
import { Pricing } from './pricing';
import { Newsletter } from './newsletter';
import { Hero } from './hero';
import { Technology } from './technology';
import { Handover } from './handover';
import { Offerings } from './offerings';
import { Planning } from './planning';
import { Invitation } from './invitation';
import { Footer } from './footer';
import { PageShell, Header, Faq } from './interactions';
import questions from './faq-data.json';
import './reference.css';
import './new.css';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': 'https://jonasinfocus.com/#business',
      name: 'Jonas',
      url: 'https://jonasinfocus.com',
      description:
        'Independent design and development for websites, SaaS products, and custom web applications.',
      areaServed: 'Worldwide',
    },
    {
      '@type': 'FAQPage',
      mainEntity: questions.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  ],
};

const criticalFonts = [
  '/new/83afe278b6a6bb3c-s.p.2bn3s6zvc0dyp.woff2',
  '/new/03bda585a99c6450-s.p.32sris142tqlb.woff2',
];

export default async function HomePage() {
  for (const href of criticalFonts) {
    preload(href, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  }
  const newsletterEnabled = await getNewsletterEnabled();
  return (
    <PageShell>
      <Header newsletterEnabled={newsletterEnabled} />
      <main id="main" className="flex-1">
        <Hero />
        {newsletterEnabled && (
          <div className="newsletter-section">
            <Newsletter />
          </div>
        )}
        <Pricing />
        <Technology />
        <Offerings />
        <Handover />
        <Planning />
        <Faq />
        <Invitation />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </PageShell>
  );
}
