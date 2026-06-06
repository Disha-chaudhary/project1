import { useState, useEffect, useRef } from "react";
import "./landing.scss";

// ── Scroll reveal hook ────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("revealed")),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const link = (id, label) => (
    <a href={`#${id}`} onClick={() => setOpen(false)}>
      {label}
    </a>
  );

  return (
    <header className={`nav ${scrolled ? "nav--solid" : ""}`}>
      <div className="nav__inner">
        <a href="#" className="nav__logo">
          <span className="nav__logo-mark" aria-hidden="true" />
          Mockly
        </a>

        <nav className={`nav__links ${open ? "nav__links--open" : ""}`}>
          {link("features", "Features")}
          {link("how-it-works", "How It Works")}
          {link("contact", "Contact")}
        </nav>

        <div className="nav__actions">
          <a href="#" className="btn btn--ghost">Login</a>
          <a href="#" className="btn btn--gradient">Register</a>
        </div>

        <button
          className={`nav__burger ${open ? "nav__burger--open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg-glow" aria-hidden="true" />

      <div className="hero__inner">
        <div className="hero__copy">
          <div className="hero__eyebrow">AI Interview Preparation</div>
          <h1 className="hero__title">
            Practice Smarter.<br />
            <span className="grad-text">Interview Better.</span>
          </h1>
          <p className="hero__sub">
            Mockly helps you prepare for interviews with AI-generated questions,
            resume-based assessments, and instant feedback.
          </p>
          <div className="hero__btns">
            <a href="#" className="btn btn--gradient btn--lg">Get Started</a>
            <a href="#" className="btn btn--ghost btn--lg">Login</a>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hv-grid">
            {/* Main card */}
            <div className="hv-card hv-card--main">
              <div className="hv-card__header">
                <div className="hv-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>
                <div>
                  <p className="hv-card__title">AI Interviewer</p>
                  <p className="hv-card__sub">Ready to start</p>
                </div>
                <div className="hv-pill hv-pill--live">Live</div>
              </div>
              <div className="hv-question">
                <p className="hv-question__label">Question 2 of 6</p>
                <p className="hv-question__text">
                  "Walk me through a project where you had to learn something quickly under pressure."
                </p>
              </div>
              <div className="hv-wave" aria-hidden="true">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span key={i} style={{ animationDelay: `${i * 0.06}s` }} />
                ))}
              </div>
            </div>

            {/* Resume card */}
            <div className="hv-card hv-card--resume">
              <div className="hv-card__icon hv-card__icon--cyan">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="8" y1="13" x2="16" y2="13"/>
                  <line x1="8" y1="17" x2="16" y2="17"/>
                  <line x1="8" y1="9" x2="10" y2="9"/>
                </svg>
              </div>
              <p className="hv-card__title">Resume Analyzed</p>
              <div className="hv-tags">
                <span>React</span><span>TypeScript</span><span>Node.js</span>
              </div>
              <div className="hv-progress-row">
                <span>Match Score</span>
                <div className="hv-bar"><div className="hv-bar__fill" style={{ width: "78%" }} /></div>
                <span>78%</span>
              </div>
            </div>

            {/* Feedback card */}
            <div className="hv-card hv-card--feedback">
              <div className="hv-card__icon hv-card__icon--violet">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <p className="hv-card__title">Feedback Ready</p>
              <div className="hv-metrics">
                <div className="hv-metric">
                  <p>Clarity</p>
                  <div className="hv-donut hv-donut--84" />
                </div>
                <div className="hv-metric">
                  <p>Structure</p>
                  <div className="hv-donut hv-donut--72" />
                </div>
                <div className="hv-metric">
                  <p>Depth</p>
                  <div className="hv-donut hv-donut--91" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="16" y2="17"/>
      </svg>
    ),
    title: "Resume-Based Questions",
    desc: "Upload your resume and get interview questions generated specifically around your experience, skills, and target role.",
    accent: "cyan",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="10 8 16 12 10 16 10 8"/>
      </svg>
    ),
    title: "AI Mock Interviews",
    desc: "Engage in realistic, adaptive interview sessions powered by AI. Practice at your own pace, as many times as you need.",
    accent: "violet",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    title: "Instant Feedback",
    desc: "Receive detailed analysis of your answers including clarity, structure, relevance, and areas to improve — right after each session.",
    accent: "grad",
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="section-inner">
        <div className="section-header" data-reveal>
          <p className="section-eyebrow">What Mockly Offers</p>
          <h2 className="section-title">Built for serious preparation</h2>
          <p className="section-desc">
            Every tool in Mockly is designed to make your practice sessions more effective and your feedback more actionable.
          </p>
        </div>

        <div className="features__grid">
          {FEATURES.map((f, i) => (
            <div
              className={`feat-card feat-card--${f.accent}`}
              key={f.title}
              data-reveal
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="feat-card__icon">{f.icon}</div>
              <h3 className="feat-card__title">{f.title}</h3>
              <p className="feat-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
const STEPS = [
  {
    n: "01",
    title: "Upload Resume",
    desc: "Start by uploading your resume. Mockly parses it to understand your background and tailor the interview experience.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    n: "02",
    title: "Take Mock Interview",
    desc: "Answer AI-generated questions relevant to your role. Speak or type — the session adapts to your responses.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
      </svg>
    ),
  },
  {
    n: "03",
    title: "Review AI Feedback",
    desc: "Get a structured report highlighting your strengths and the specific areas where your answers can improve.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
];

function HowItWorks() {
  return (
    <section className="hiw" id="how-it-works">
      <div className="section-inner">
        <div className="section-header" data-reveal>
          <p className="section-eyebrow">The Process</p>
          <h2 className="section-title">Three steps to better interviews</h2>
        </div>

        <div className="hiw__steps">
          {STEPS.map((s, i) => (
            <div
              className="hiw__step"
              key={s.n}
              data-reveal
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              {i < STEPS.length - 1 && (
                <div className="hiw__connector" aria-hidden="true" />
              )}
              <div className="hiw__num">{s.n}</div>
              <div className="hiw__icon">{s.icon}</div>
              <h3 className="hiw__title">{s.title}</h3>
              <p className="hiw__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Why Mockly ────────────────────────────────────────────────────────────────
const WHY = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    title: "Personalized Preparation",
    desc: "Questions are generated from your actual resume, not generic templates.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: "AI-Powered Evaluation",
    desc: "Answers are evaluated on clarity, relevance, structure, and depth.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Realistic Experience",
    desc: "Interview sessions are conversational and time-aware, mirroring real conditions.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    title: "Continuous Improvement",
    desc: "Track your progress over multiple sessions and see where you're growing.",
  },
];

function WhyMockly() {
  return (
    <section className="why">
      <div className="section-inner">
        <div className="section-header" data-reveal>
          <p className="section-eyebrow">Why Mockly</p>
          <h2 className="section-title">Designed around how you actually improve</h2>
        </div>

        <div className="why__grid">
          {WHY.map((w, i) => (
            <div
              className="why-card"
              key={w.title}
              data-reveal
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="why-card__icon">{w.icon}</div>
              <h3 className="why-card__title">{w.title}</h3>
              <p className="why-card__desc">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="cta" id="contact">
      <div className="cta__bg" aria-hidden="true" />
      <div className="section-inner">
        <div className="cta__box" data-reveal>
          <p className="section-eyebrow">Get Started</p>
          <h2 className="cta__title">Ready to Ace Your Next Interview?</h2>
          <p className="cta__desc">
            Start practicing with Mockly and build confidence before your next opportunity.
          </p>
          <div className="cta__btns">
            <a href="#" className="btn btn--gradient btn--lg">Get Started</a>
            <a href="#" className="btn btn--ghost btn--lg">Create Account</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <a href="#" className="nav__logo">
            <span className="nav__logo-mark" aria-hidden="true" />
            Mockly
          </a>
          <p className="footer__tagline">AI-powered interview preparation.</p>
        </div>

        <nav className="footer__nav">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="footer__social">
          <a href="#" aria-label="GitHub" className="footer__icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn" className="footer__icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Mockly. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function Landing() {
  useReveal();
  return (
    <div className="landing">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <WhyMockly />
      <CTA />
      <Footer />
    </div>
  );
}
