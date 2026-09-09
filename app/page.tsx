'use client';

import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Check,
  Code2,
  Globe2,
  Layers3,
  Sparkles,
  LayoutGrid,
  MousePointer2,
  Plus,
  Command,
  Circle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const questions = [
  [
    'What kinds of projects can we work on?',
    'Business websites, landing pages, custom web applications, and internal tools. Whether you have a clear brief or an early idea, we can work out what is worth building first.',
  ],
  [
    'How much does a project cost?',
    'Every project has a different scope. After we talk through what you need, I’ll put together a proposal with a clear price, deliverables, and timeline before work begins.',
  ],
  [
    'Do I need a design before we start?',
    'No. Bring your idea, a few references, or the problem you want to solve. I can help shape the structure and design, then build the finished experience.',
  ],
  [
    'What does working together look like?',
    'You work directly with me. We agree on the scope, review the design, and build in stages so you can see progress and give feedback along the way.',
  ],
  [
    'Can you help after launch?',
    'Yes. We can agree on ongoing support, improvements, and new features as part of the project. We’ll make that plan together before launch.',
  ],
];

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);
  const [project, setProject] = useState<'website' | 'application' | null>(
    null,
  );
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll('.reveal')
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  const startProject = () => setContactOpen(true);
  return (
    <main>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header wrap">
        <a href="#main-content" className="wordmark" aria-label="Jonas home">
          jonas<span className="brand-dot">.</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
        </nav>
        <button
          className="button button-small button-dark"
          onClick={startProject}
        >
          Let’s talk <ArrowUpRight size={15} />
        </button>
      </header>
      <section className="hero" id="main-content">
        <div className="hero-light" aria-hidden="true" />
        <div className="hero-content wrap">
          <p className="availability">
            <span /> Independent engineer & developer
          </p>
          <h1>
            You have an idea.
            <br />
            Let’s make it <em>real.</em>
          </h1>
          <p className="hero-description">
            I’m Jonas. I design and build thoughtful websites
            <br className="desktop-break" /> and web apps for people ready to
            make their next move.
          </p>
          <div className="hero-actions">
            <button className="button button-white" onClick={startProject}>
              Start a project <ArrowUpRight size={17} />
            </button>
            <a className="button button-outline" href="#work">
              Explore my work <ArrowDown size={16} />
            </a>
          </div>
        </div>
        <div className="hero-bottom wrap">
          <span>YOUR IDEA. MY FULL ATTENTION.</span>
          <a href="#work">
            A little further down <ArrowDown size={14} />
          </a>
          <span>DESIGNED & BUILT BY JONAS</span>
        </div>
      </section>

      <section className="wrap section" id="work">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">A GLIMPSE OF WHAT’S POSSIBLE</p>
            <h2>
              Good ideas deserve
              <br />
              <span>a great build.</span>
            </h2>
          </div>
          <p className="heading-note">
            A home for your business.
            <br />A better way to get things done.
          </p>
        </div>
        <div className="project-grid">
          <button
            className="project-card reveal"
            onClick={() => setProject('website')}
            aria-label="Explore Forma website concept"
          >
            <div className="project-stage stage-website">
              <div className="mini-site" aria-hidden="true">
                <div className="mini-nav">
                  <strong>
                    forma<span>®</span>
                  </strong>
                  <span>Spaces &nbsp; Studio &nbsp; Contact ↗</span>
                </div>
                <div className="mini-site-body">
                  <span className="mini-label">SPACES TO LIVE WELL</span>
                  <div>
                    Considered design.
                    <br />
                    <i>Extraordinary living.</i>
                  </div>
                  <p>A new perspective on the spaces we call home.</p>
                  <span className="mini-link">Explore the collection ↗</span>
                </div>
                <div className="mini-architecture">
                  <div />
                  <div />
                  <div />
                  <span>01 / 03</span>
                </div>
              </div>
              <span className="stage-caption">WEBSITE CONCEPT</span>
            </div>
            <div className="project-caption">
              <div>
                <h3>Forma</h3>
                <p>A considered home for a design studio.</p>
              </div>
              <span className="circle-link">
                <ArrowUpRight size={19} />
              </span>
            </div>
            <div className="project-tags">
              <span>Web design</span>
              <span>Development</span>
              <span>Concept</span>
            </div>
          </button>
          <button
            className="project-card reveal"
            onClick={() => setProject('application')}
            aria-label="Explore Orbit application concept"
          >
            <div className="project-stage stage-app">
              <div className="mini-app" aria-hidden="true">
                <aside>
                  <strong>
                    <Command size={13} /> orbit
                  </strong>
                  <span className="mini-active">
                    <LayoutGrid size={10} /> Overview
                  </span>
                  <span>
                    <Layers3 size={10} /> Projects
                  </span>
                  <span>
                    <Circle size={10} /> Activity
                  </span>
                  <span className="mini-bottom">Your workspace</span>
                </aside>
                <div className="mini-dashboard">
                  <div className="mini-dashboard-top">
                    <span>Workspace / Overview</span>
                    <span>J</span>
                  </div>
                  <div className="mini-dashboard-title">
                    <div>
                      <h4>A little more clarity.</h4>
                      <p>Everything you’re working on, in one place.</p>
                    </div>
                    <Plus size={12} />
                  </div>
                  <div className="mini-stats">
                    <div>
                      <span>Active projects</span>
                      <strong>
                        12 <small>+2 this week</small>
                      </strong>
                    </div>
                    <div>
                      <span>Tasks completed</span>
                      <strong>
                        84 <small>↑ 18%</small>
                      </strong>
                    </div>
                  </div>
                  <div className="mini-chart">
                    <span>Project activity</span>
                    <div className="bars">
                      {[30, 48, 39, 65, 51, 75, 63, 87, 72, 90, 81, 96].map(
                        (height, index) => (
                          <i key={index} style={{ height: `${height}%` }} />
                        ),
                      )}
                    </div>
                    <div className="chart-labels">
                      <span>MON</span>
                      <span>TUE</span>
                      <span>WED</span>
                      <span>THU</span>
                      <span>FRI</span>
                    </div>
                  </div>
                </div>
              </div>
              <span className="stage-caption">
                APPLICATION CONCEPT · SAMPLE DATA
              </span>
            </div>
            <div className="project-caption">
              <div>
                <h3>Orbit</h3>
                <p>Less busywork. A clearer picture.</p>
              </div>
              <span className="circle-link">
                <ArrowUpRight size={19} />
              </span>
            </div>
            <div className="project-tags">
              <span>Product design</span>
              <span>Web application</span>
              <span>Concept</span>
            </div>
          </button>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="wrap section">
          <div className="center-heading reveal">
            <p className="eyebrow">HOW I CAN HELP</p>
            <h2>
              Built for where
              <br />
              you want to go.
            </h2>
            <p className="section-description">
              Start with what your business needs.
              <br />
              We’ll work out the right way to build it.
            </p>
          </div>
          <div className="service-grid">
            <article className="service-card reveal">
              <div className="service-art art-web" aria-hidden="true">
                <Globe2 size={33} strokeWidth={1} />
                <span>MAKE YOUR FIRST IMPRESSION COUNT</span>
              </div>
              <div className="service-body">
                <div className="service-title">
                  <h3>Websites</h3>
                  <span>YOUR ONLINE HOME</span>
                </div>
                <p>
                  A distinctive, fast website that tells your story and gives
                  people a reason to get in touch.
                </p>
                <ul>
                  <li>
                    <Check />
                    Custom design, built around your brand
                  </li>
                  <li>
                    <Check />A polished experience on every screen
                  </li>
                  <li>
                    <Check />
                    Search-friendly structure and fast loading
                  </li>
                  <li>
                    <Check />
                    Launch, handover, and room to grow
                  </li>
                </ul>
                <button
                  className="button button-outline"
                  onClick={startProject}
                >
                  Let’s build your website <ArrowUpRight size={16} />
                </button>
              </div>
            </article>
            <article className="service-card reveal">
              <div className="service-art art-app" aria-hidden="true">
                <Code2 size={36} strokeWidth={1} />
                <span>TURN YOUR IDEA INTO SOMETHING USEFUL</span>
              </div>
              <div className="service-body">
                <div className="service-title">
                  <h3>Web applications</h3>
                  <span>YOUR NEXT PRODUCT</span>
                </div>
                <p>
                  Custom software for the way you work. Take an idea to launch,
                  or replace a process you’ve outgrown.
                </p>
                <ul>
                  <li>
                    <Check />
                    Product planning and interface design
                  </li>
                  <li>
                    <Check />
                    Accounts, dashboards, and workflows
                  </li>
                  <li>
                    <Check />
                    Integrations with the tools you rely on
                  </li>
                  <li>
                    <Check />A foundation for the next feature
                  </li>
                </ul>
                <button className="button button-white" onClick={startProject}>
                  Let’s build your application <ArrowUpRight size={16} />
                </button>
              </div>
            </article>
          </div>
          <p className="service-footnote">
            Have something else in mind?{' '}
            <button onClick={startProject}>
              Tell me about it <ArrowRight size={14} />
            </button>
          </p>
        </div>
      </section>

      <section className="wrap section about-section" id="about">
        <div className="reveal">
          <p className="eyebrow">THE PERSON BEHIND THE PIXELS</p>
          <h2>
            One developer.
            <br />
            <span>In your corner.</span>
          </h2>
          <p className="section-description">
            I’m Jonas, an engineer and solo developer who enjoys turning a rough
            idea into something people can actually use.
          </p>
          <p className="section-description">
            You’ll work directly with the person designing and building your
            project. I care about the details you see, the ones you feel, and
            the code that keeps it all running.
          </p>
          <div className="signature">
            Jonas<span>INDEPENDENT BY DESIGN.</span>
          </div>
        </div>
        <div className="principles reveal">
          {[
            {
              Icon: MousePointer2,
              title: 'Thoughtful by design',
              description:
                'Every page and interaction should make sense to the person using it.',
            },
            {
              Icon: Code2,
              title: 'Built with care',
              description:
                'Good engineering makes a product easier to run, maintain, and improve.',
            },
            {
              Icon: Sparkles,
              title: 'Direct from day one',
              description:
                'Clear conversations, visible progress, and one person who knows your project.',
            },
          ].map(({ Icon, title, description }) => {
            return (
              <div className="principle" key={title}>
                <span className="principle-icon">
                  <Icon size={21} strokeWidth={1.5} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="wrap process-section">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">A SIMPLE WAY TO WORK TOGETHER</p>
            <h2>
              From “what if” to <em>it’s live.</em>
            </h2>
          </div>
        </div>
        <div className="process-grid">
          {[
            [
              '01',
              'Talk it through',
              'Tell me what you’re thinking. We’ll define the goal, the scope, and a plan that makes sense.',
            ],
            [
              '02',
              'Make it take shape',
              'We’ll work through the design, then build in stages with space for your feedback.',
            ],
            [
              '03',
              'Put it out into the world',
              'We’ll check the details, launch your project, and make sure you know what comes next.',
            ],
          ].map(([number, title, description]) => (
            <div className="process-step reveal" key={number}>
              <span className="step-number">
                {number}
                <ArrowRight size={15} />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap section faq-section" id="faq">
        <div className="center-heading reveal">
          <p className="eyebrow">GOOD TO KNOW</p>
          <h2>
            A few things you
            <br />
            might be wondering.
          </h2>
        </div>
        <Accordion className="faq-list reveal" defaultValue={[0]}>
          {questions.map(([question, answer], index) => (
            <AccordionItem value={index} key={question}>
              <AccordionTrigger className="faq-trigger">
                <span className="faq-number">0{index + 1}</span>
                <span>{question}</span>
              </AccordionTrigger>
              <AccordionContent className="faq-answer">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-glow" aria-hidden="true" />
        <div className="wrap contact-content reveal">
          <p className="availability">
            <span /> GOOD THINGS START WITH A CONVERSATION
          </p>
          <h2>
            Got something
            <br />
            <em>in mind?</em>
          </h2>
          <p>
            Let’s turn that idea you’ve been sitting on
            <br className="desktop-break" /> into something out in the world.
          </p>
          <button className="button button-white" onClick={startProject}>
            Start a project <ArrowUpRight size={17} />
          </button>
          <span className="contact-note">
            Your idea doesn’t have to be fully figured out.
          </span>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          let’s build.
        </div>
        <footer className="wrap">
          <a href="#main-content" className="wordmark">
            jonas<span className="brand-dot">.</span>
          </a>
          <span>Independent engineer. Thoughtful work.</span>
          <a href="#main-content">
            Back to top <ArrowUpRight size={14} />
          </a>
          <span>© {new Date().getFullYear()} Jonas</span>
        </footer>
      </section>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="contact-dialog">
          <span className="dialog-icon">
            <ArrowUpRight size={27} />
          </span>
          <p className="eyebrow">LET’S TALK</p>
          <DialogTitle className="dialog-title">
            Something good starts here.
          </DialogTitle>
          <DialogDescription className="dialog-description">
            This is a preview of Jonas’s new website. The email address or
            booking link will be added here before the public launch.
          </DialogDescription>
          <div className="placeholder-contact">Contact details coming soon</div>
          <p className="dialog-footnote">
            No messages or personal information are collected.
          </p>
        </DialogContent>
      </Dialog>
      <Dialog
        open={project !== null}
        onOpenChange={(open) => {
          if (!open) setProject(null);
        }}
      >
        <DialogContent className="contact-dialog">
          <p className="eyebrow">DESIGN CONCEPT</p>
          <DialogTitle className="dialog-title">
            {project === 'website' ? 'Forma' : 'Orbit'}
          </DialogTitle>
          <DialogDescription className="dialog-description">
            {project === 'website'
              ? 'A concept for a design studio website, with a quiet visual identity, clear project presentation, and a simple path to an enquiry.'
              : 'A concept for a project workspace, bringing progress, tasks, and activity into a single view. All figures shown are sample data.'}
          </DialogDescription>
          <p className="concept-disclosure">
            This is a portfolio placeholder, not a completed client project.
          </p>
          <button
            className="button button-white"
            onClick={() => {
              setProject(null);
              setContactOpen(true);
            }}
          >
            Have a similar idea? <ArrowUpRight size={16} />
          </button>
        </DialogContent>
      </Dialog>
    </main>
  );
}
