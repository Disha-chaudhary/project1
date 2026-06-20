import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./MockResult.scss";

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

export default function MockResult() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const stored = sessionStorage.getItem(`mock-result-${interviewId}`);
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, [interviewId]);

  if (!result) {
    return (
      <div className="mr-loading">
        <div className="mr-spinner" />
        Loading results...
      </div>
    );
  }

  const scoreColor = result.matchScore >= 75 ? "#00f5a0" : result.matchScore >= 50 ? "#f5c400" : "#f55a00";
  const scoreLabel = result.matchScore >= 75 ? "Strong Performance!" : result.matchScore >= 50 ? "Good Effort!" : "Keep Practicing!";

  const TABS = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "feedback", label: "Question Feedback", icon: "💬" },
    { id: "gaps", label: "Skill Gaps", icon: "🎯" },
    { id: "plan", label: "Prep Plan", icon: "🗺️" },
  ];

  return (
    <div className="mr-root">
      <Background />

      {/* Navbar */}
      <nav className="mr-nav">
        <div className="mr-nav__brand">
          <MocklyLogo />
        </div>
        <div className="mr-nav__actions">
          <button className="mr-nav__btn" onClick={() => navigate(`/mock-interview/${interviewId}`)}>
            🔁 Retake Interview
          </button>
          <button className="mr-nav__btn mr-nav__btn--outline" onClick={() => navigate(`/interview/${interviewId}`)}>
            📚 Practice Questions
          </button>
        </div>
      </nav>

      <div className="mr-wrap">
        <div className="mr-hero">
          <div className="mr-score-ring" style={{ "--score-color": scoreColor }}>
            <svg viewBox="0 0 120 120">
              <circle className="mr-ring-track" cx="60" cy="60" r="54" />
              <circle
                className="mr-ring-fill"
                cx="60" cy="60" r="54"
                stroke={scoreColor}
                strokeDasharray={`${(result.matchScore / 100) * 339.3} 339.3`}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="mr-score-label">
              <span className="mr-score-num" style={{ color: scoreColor }}>{result.matchScore}</span>
              <span className="mr-score-pct">%</span>
            </div>
          </div>
          <div className="mr-hero-text">
            <h1 style={{ color: scoreColor }}>{scoreLabel}</h1>
            <p className="mr-overall-feedback">{result.overallFeedback}</p>
          </div>
        </div>

        <div className="mr-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`mr-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="mr-section">
            <div className="mr-overview-cards">
              <div className="mr-ov-card">
                <span className="mr-ov-icon">⚙️</span>
                <div>
                  <p className="mr-ov-label">Technical Avg</p>
                  <p className="mr-ov-val">
                    {Math.round(
                      result.questionFeedbacks
                        .filter(q => q.type === "technical")
                        .reduce((sum, q) => sum + q.score, 0) /
                      (result.questionFeedbacks.filter(q => q.type === "technical").length || 1)
                    )}%
                  </p>
                </div>
              </div>
              <div className="mr-ov-card">
                <span className="mr-ov-icon">🧠</span>
                <div>
                  <p className="mr-ov-label">Behavioral Avg</p>
                  <p className="mr-ov-val">
                    {Math.round(
                      result.questionFeedbacks
                        .filter(q => q.type === "behavioral")
                        .reduce((sum, q) => sum + q.score, 0) /
                      (result.questionFeedbacks.filter(q => q.type === "behavioral").length || 1)
                    )}%
                  </p>
                </div>
              </div>
              <div className="mr-ov-card">
                <span className="mr-ov-icon">🎯</span>
                <div>
                  <p className="mr-ov-label">Skill Gaps</p>
                  <p className="mr-ov-val">{result.skillGaps?.length || 0}</p>
                </div>
              </div>
              <div className="mr-ov-card">
                <span className="mr-ov-icon">📅</span>
                <div>
                  <p className="mr-ov-label">Prep Days</p>
                  <p className="mr-ov-val">{result.preparationPlan?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="mr-section">
            <div className="mr-feedbacks">
              {result.questionFeedbacks.map((fb, i) => {
                const fbColor = fb.score >= 75 ? "#00f5a0" : fb.score >= 50 ? "#f5c400" : "#f55a00";
                return (
                  <div className="mr-fb-card" key={i}>
                    <div className="mr-fb-top">
                      <span className={`mr-fb-type ${fb.type}`}>{fb.type === "technical" ? "⚙️ Technical" : "🧠 Behavioral"}</span>
                      <span className="mr-fb-score" style={{ color: fbColor }}>{fb.score}/100</span>
                    </div>
                    <p className="mr-fb-question">{fb.question}</p>
                    <div className="mr-fb-grid">
                      <div className="mr-fb-block">
                        <span className="mr-fb-label">Technical Accuracy</span>
                        <p>{fb.technicalFeedback}</p>
                      </div>
                      <div className="mr-fb-block">
                        <span className="mr-fb-label">Communication</span>
                        <p>{fb.communicationFeedback}</p>
                      </div>
                    </div>
                    <div className="mr-fb-improve">
                      <span className="mr-fb-label">💡 How to Improve</span>
                      <p>{fb.improvement}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "gaps" && (
          <div className="mr-section">
            <div className="mr-gaps">
              {result.skillGaps?.map((gap, i) => (
                <div className="mr-gap-card" key={i}>
                  <div className="mr-gap-top">
                    <span className="mr-gap-skill">{gap.skill}</span>
                    <span className={`mr-gap-severity sev-${gap.severity?.toLowerCase()}`}>{gap.severity}</span>
                  </div>
                  <p className="mr-gap-desc">{gap.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "plan" && (
          <div className="mr-section">
            <div className="mr-timeline">
              {result.preparationPlan?.map((step, i) => (
                <div className="mr-tl-item" key={i}>
                  <div className="mr-tl-dot">
                    <span>{step.day}</span>
                    {i < result.preparationPlan.length - 1 && <div className="mr-tl-line" />}
                  </div>
                  <div className="mr-tl-content">
                    <h4>Day {step.day} — {step.focus}</h4>
                    <p><strong>Resources:</strong> {step.resources}</p>
                    <p><strong>Task:</strong> {step.task}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="mr-bg" aria-hidden="true">
      <div className="mr-orb mr-orb--a" />
      <div className="mr-orb mr-orb--b" />
      <div className="mr-orb mr-orb--c" />
      <div className="mr-grid" />
    </div>
  );
}