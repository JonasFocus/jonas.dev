'use client';

import { ArrowUpRight, Sparkles } from 'lucide-react';
import './project-invitation.css';

export function ProjectInvitation({
  onStartProject,
}: {
  onStartProject: () => void;
}) {
  return (
    <section
      className="invitation-section wrap"
      id="contact"
      aria-labelledby="invitation-heading"
    >
      <div className="invitation-layout">
        <div className="invitation-intro reveal">
          <p className="eyebrow">AN OPEN INVITATION</p>
          <h2 id="invitation-heading">
            Let’s make
            <br />
            something useful.
          </h2>
          <p>
            Tell me what you’re thinking. We’ll figure out the right place to
            start.
          </p>
        </div>
        <article className="invitation-card reveal">
          <div className="invitation-art" aria-hidden="true">
            <span className="invitation-seal">
              <Sparkles size={31} strokeWidth={1} />
            </span>
            <span>LET’S MAKE SOMETHING GOOD</span>
          </div>
          <div className="invitation-body">
            <span className="invitation-label">FROM JONAS, TO YOU</span>
            <h3>
              Your next project
              <br />
              starts here.
            </h3>
            <ol>
              <li>
                <span>01</span>Share the idea
              </li>
              <li>
                <span>02</span>Talk through scope
              </li>
              <li>
                <span>03</span>Get a clear proposal
              </li>
            </ol>
            <button
              className="button button-white"
              type="button"
              onClick={onStartProject}
            >
              Start a project <ArrowUpRight size={17} aria-hidden="true" />
            </button>
            <p className="invitation-note">A rough idea is enough to start.</p>
          </div>
        </article>
      </div>
      <footer className="invitation-footer">
        <a
          className="invitation-wordmark"
          href="#main-content"
          aria-label="Jonas home"
        >
          jonas<span>.</span>
        </a>
        <nav aria-label="Footer navigation">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#process">Process</a>
        </nav>
        <span className="invitation-copyright">
          © {new Date().getFullYear()} Jonas
        </span>
      </footer>
    </section>
  );
}
