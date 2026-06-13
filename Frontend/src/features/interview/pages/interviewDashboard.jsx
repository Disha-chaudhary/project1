import { useState, useEffect, useRef } from "react";
import "./InterviewDashboard.scss";
import { useParams } from "react-router-dom";
import { useInterview } from "../hooks/useinterview";

/* ── ANIMATED SCORE RING ── */
const AnimatedScore = ({ score }) => {
  const [displayed, setDisplayed] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;
  const color = score >= 75 ? "#00f5a0" : score >= 50 ? "#f5c400" : "#f55a00";

  useEffect(() => {
    let start = null;
    const duration = 1400;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="score-ring-wrap">
      <svg className="score-ring" viewBox="0 0 120 120">
        <defs>
          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#glowGrad)" />
        <circle className="track" cx="60" cy="60" r={radius} fill="none" strokeWidth="8" />
        <circle
          className="progress"
          cx="60" cy="60" r={radius}
          fill="none" strokeWidth="8"
          stroke={color} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          filter="url(#glow)"
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
      </svg>
      <div className="score-label">
        <span className="score-num" style={{ color }}>{displayed}</span>
        <span className="score-pct">%</span>
        <span className="score-tag">Match</span>
      </div>
    </div>
  );
};

/* ── ACCORDION CARD ── */
const AccordionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(open ? bodyRef.current.scrollHeight : 0);
    }
  }, [open]);

  const isString = typeof item === "string";
  const question = isString ? item : item.question || item;
  const answer   = !isString ? item.answer || item.suggestedAnswer || null : null;
  const intention= !isString ? item.intention || item.purpose || null : null;

  return (
    <div className={`accordion-card ${open ? "open" : ""}`} style={{ "--i": index }}>
      <button className="accordion-header" onClick={() => setOpen(!open)}>
        <span className="q-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="q-text">{question}</span>
        <span className="accordion-chevron">{open ? "−" : "+"}</span>
      </button>
      <div
        className="accordion-body"
        style={{ height, overflow: "hidden", transition: "height 0.35s cubic-bezier(0.4,0,0.2,1)" }}
      >
        <div ref={bodyRef} className="accordion-inner">
          {answer && (
            <div className="answer-block">
              <span className="block-label">💡 Suggested Answer</span>
              <p>{answer}</p>
            </div>
          )}
          {intention && (
            <div className="intention-block">
              <span className="block-label">🎯 Interviewer Intent</span>
              <p>{intention}</p>
            </div>
          )}
          {!answer && !intention && (
            <p className="no-detail">Prepare a concise, specific example using the STAR method.</p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── SKILL GAPS ── */
const SkillGaps = ({ gaps }) => {
  // Step 5: list is directly the gaps array of objects
  const list = gaps || [];

  return (
    <div className="skill-gaps-panel">
      <h2 className="panel-title">Skill Gaps</h2>
      <p className="panel-subtitle">Areas to strengthen before your interview</p>
      <div className="chips-grid">
        {gaps.map((gap, i) => (
          <span key={i} className="glow-chip" style={{ "--delay": `${i * 0.07}s` }}>
            {gap.skill}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── PREP TIMELINE ── */
const PrepTimeline = ({ plan }) => {
  const items = Array.isArray(plan)
    ? plan
    : typeof plan === "string"
    ? plan.split(/\n|\d+\./).map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="prep-timeline-panel">
      <h2 className="panel-title">Preparation Plan</h2>
      <p className="panel-subtitle">Your personalised roadmap to interview success</p>
      <div className="timeline">
        {items.map((step, i) => (
          <div key={i} className="timeline-item" style={{ "--delay": `${i * 0.1}s` }}>
            <div className="tl-dot">
              <span>{i + 1}</span>
              {i < items.length - 1 && <div className="tl-line" />}
            </div>
            <div className="tl-content">
              {/* Step 6: render structured object fields */}
              <>
                <h4>Day {step.day}</h4>
                <p><strong>Focus:</strong> {step.focus}</p>
                <p><strong>Resources:</strong> {step.resources}</p>
                <p><strong>Task:</strong> {step.task}</p>
              </>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── TABS CONFIG ── */
const TABS = [
  { id: "technical",  label: "Technical Questions",  icon: "⚙️" },
  { id: "behavioral", label: "Behavioral Questions", icon: "🧠" },
  { id: "skillgaps",  label: "Skill Gaps",           icon: "📊" },
  { id: "prep",       label: "Preparation Plan",     icon: "🗺️" },
];

/* ── MAIN EXPORT ── */
export default function InterviewDashboard() {
  const { interviewId } = useParams();

  const {
    interviewReport,
    getReportById,
    loading,
  } = useInterview();

  const [activeTab, setActiveTab] = useState("technical");
  const [animateIn, setAnimateIn] = useState(true);

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  if (loading) {
    return <div className="loading">Loading Report...</div>;
  }

  if (!interviewReport) {
    return <div className="loading">Report Not Found</div>;
  }

  const report = interviewReport;

  const {
    matchScore = 0,
    technicalQuestions  = [],
    behavioralQuestions = [],
    skillGaps           = [],
    preparationPlan     = [],
  } = report;

  // Step 4: skillGaps is an array of objects with .skill
  const gapList = skillGaps.map((gap) => gap.skill);

  const handleTab = (id) => {
    if (id === activeTab) return;
    setAnimateIn(false);
    setTimeout(() => { setActiveTab(id); setAnimateIn(true); }, 180);
  };

  return (
    <div className="idb-root">
      {/* Ambient BG */}
      <div className="idb-bg">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="grid-lines" />
      </div>

      <div className="idb-layout">
        {/* SIDEBAR */}
        <aside className="idb-sidebar">
          <div className="sidebar-brand">
            <span className="brand-icon">⚡</span>
            <span className="brand-text">Interview<br />Intel</span>
          </div>
          <nav className="sidebar-nav">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                {activeTab === tab.id && <span className="tab-active-bar" />}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className={`idb-main ${animateIn ? "fade-in" : "fade-out"}`}>
          {activeTab === "technical" && (
            <div className="questions-panel">
              <h2 className="panel-title">Technical Questions</h2>
              <p className="panel-subtitle">
                {technicalQuestions.length} questions · Click any card to reveal answer
              </p>
              <div className="accordion-list">
                {technicalQuestions.map((q, i) => (
                  <AccordionCard key={i} item={q} index={i} />
                ))}
              </div>
            </div>
          )}
          {activeTab === "behavioral" && (
            <div className="questions-panel">
              <h2 className="panel-title">Behavioral Questions</h2>
              <p className="panel-subtitle">
                {behavioralQuestions.length} questions · Click any card to reveal answer
              </p>
              <div className="accordion-list">
                {behavioralQuestions.map((q, i) => (
                  <AccordionCard key={i} item={q} index={i} />
                ))}
              </div>
            </div>
          )}
          {activeTab === "skillgaps" && <SkillGaps gaps={skillGaps} />}
          {activeTab === "prep"      && <PrepTimeline plan={preparationPlan} />}
        </main>

        {/* RIGHT PANEL */}
        <aside className="idb-right">
          <div className="right-score-card">
            <h3 className="right-heading">Match Score</h3>
            <AnimatedScore score={matchScore} />
            <p className="score-caption">
              {matchScore >= 75
                ? "Strong fit — you're well positioned!"
                : matchScore >= 50
                ? "Good potential — close the gaps!"
                : "Room to grow — focus on prep!"}
            </p>
          </div>

          <div className="right-gaps-card">
            <h3 className="right-heading">Key Gaps</h3>
            <div className="mini-chips">
              {/* Step 7: renamed gap -> skill for clarity */}
              {gapList.slice(0, 6).map((skill, i) => (
                <span key={i} className="mini-chip" style={{ "--delay": `${i * 0.06}s` }}>
                  {skill}
                </span>
              ))}
              {gapList.length > 6 && (
                <span
                  className="mini-chip more-chip"
                  onClick={() => handleTab("skillgaps")}
                  title="View all"
                >
                  +{gapList.length - 6} more →
                </span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
