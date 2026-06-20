import { useState, useEffect, useRef } from "react";
import "./InterviewDashboard.scss";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useInterview } from "../hooks/useinterview";
import { useAuth } from "../../auth/hooks/useAuth";

const MocklyLogo = () => (
  <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
    <svg width="36" height="36" viewBox="0 0 80 80" fill="none">
      <rect x="0" y="0" width="72" height="60" rx="14" fill="#185FA5"/>
      <polygon points="14,60 6,80 30,60" fill="#185FA5"/>
      <rect x="10" y="14" width="12" height="4" rx="2" fill="#E6F1FB"/>
      <rect x="10" y="24" width="22" height="4" rx="2" fill="#E6F1FB"/>
      <rect x="10" y="34" width="16" height="4" rx="2" fill="#E6F1FB"/>
      <rect x="10" y="44" width="28" height="4" rx="2" fill="#E6F1FB"/>
      <circle cx="62" cy="10" r="5" fill="#378ADD"/>
      <circle cx="62" cy="10" r="2.5" fill="#E6F1FB"/>
    </svg>
    <span style={{ fontSize: "22px", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.5px" }}>
      mock<span style={{ color: "#378ADD" }}>ly</span>
    </span>
  </Link>
);

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
  const list = gaps || [];
  return (
    <div className="skill-gaps-panel">
      <h2 className="panel-title">Skill Gaps</h2>
      <p className="panel-subtitle">Areas to strengthen before your interview</p>
      <div className="chips-grid">
        {list.map((gap, i) => (
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
  const items = Array.isArray(plan) ? plan : [];
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
              <h4>Day {step.day}</h4>
              <p><strong>Focus:</strong> {step.focus}</p>
              <p><strong>Resources:</strong> {step.resources}</p>
              <p><strong>Task:</strong> {step.task}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── TABS CONFIG ── */
const TABS = [
  { id: "technical",  label: "Technical",  icon: "⚙️" },
  { id: "behavioral", label: "Behavioral", icon: "🧠" },
  { id: "skillgaps",  label: "Skill Gaps", icon: "📊" },
  { id: "prep",       label: "Prep Plan",  icon: "🗺️" },
];

/* ── MAIN EXPORT ── */
export default function InterviewDashboard() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { interviewReport, getReportById, loading } = useInterview();
  const [activeTab, setActiveTab] = useState("technical");
  const [animateIn, setAnimateIn] = useState(true);

  useEffect(() => {
    if (interviewId) getReportById(interviewId);
  }, [interviewId]);

  if (loading) return <div className="idb-state">Loading questions...</div>;
  if (!interviewReport) return <div className="idb-state">Report Not Found</div>;

  const {
    jobTitle = "Interview Prep",
    technicalQuestions  = [],
    behavioralQuestions = [],
    skillGaps           = [],
    preparationPlan     = [],
  } = interviewReport;

  const handleTab = (id) => {
    if (id === activeTab) return;
    setAnimateIn(false);
    setTimeout(() => { setActiveTab(id); setAnimateIn(true); }, 180);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const totalQuestions = technicalQuestions.length + behavioralQuestions.length;

  return (
    <div className="idb-root">
      <div className="idb-bg">
        <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
        <div className="grid-lines" />
      </div>

      {/* Navbar */}
      <nav className="idb-nav">
        <div className="idb-nav__brand">
          <MocklyLogo />
        </div>
        <div className="idb-nav__center">
          <span className="idb-nav__title">{jobTitle}</span>
          <span className="idb-nav__badge">📚 Practice Mode</span>
        </div>
        <div className="idb-nav__actions">
          <button
            className="idb-nav__mock-btn"
            onClick={() => navigate(`/mock-interview/${interviewId}`)}
          >
            <span>🎯</span>
            <span>Start Mock Interview</span>
          </button>
          <button className="idb-nav__logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="idb-layout">
        {/* SIDEBAR */}
        <aside className="idb-sidebar">
          <div className="idb-sidebar__info">
            <p className="idb-sidebar__qs">{totalQuestions} Questions</p>
            <p className="idb-sidebar__hint">Study the questions and suggested answers before taking the mock interview.</p>
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

          <div className="idb-sidebar__cta">
            <p>Ready to test yourself?</p>
            <button
              className="idb-sidebar__mock-btn"
              onClick={() => navigate(`/mock-interview/${interviewId}`)}
            >
              🎯 Start Mock Interview
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className={`idb-main ${animateIn ? "fade-in" : "fade-out"}`}>
          {activeTab === "technical" && (
            <div className="questions-panel">
              <h2 className="panel-title">Technical Questions</h2>
              <p className="panel-subtitle">
                {technicalQuestions.length} questions · Click any card to reveal answer & intent
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
                {behavioralQuestions.length} questions · Click any card to reveal answer & intent
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
      </div>
    </div>
  );
}