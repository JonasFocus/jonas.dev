import { getNewsletterEnabled } from '@/lib/homepage-settings';
import { Pricing } from './pricing';
import { Newsletter } from './newsletter';
import { Hero } from './hero';
import { Technology } from './technology';
import { Services } from './services';
import { Ownership } from './ownership';
import { Planning } from './planning';
import { Invitation } from './invitation';
import { Footer } from './footer';
import { PageShell, Header, Faq } from './interactions';
import './reference.css';
import './new.css';

export default async function HomePage() {
  const newsletterEnabled = await getNewsletterEnabled();
  return (
    <PageShell>
      <Header newsletterEnabled={newsletterEnabled} />
      <main className="flex-1">
        <Hero />
        {newsletterEnabled && (
          <div className="newsletter-section">
            <Newsletter />
          </div>
        )}
        <Pricing />
        <Technology />
        <Services />
        <Ownership />
        <Planning />
        <Faq />
        <Invitation />
      </main>
      <Footer />
    </PageShell>
  );
}
