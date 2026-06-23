import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useInterview } from "../hooks/useinterview";
import { evaluateMockInterviewApi } from "../../auth/services/interview.api.js";
import "./MockInterview.scss";

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

export default function MockInterview() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { interviewReport, getReportById, loading } = useInterview();

  const [techAnswers, setTechAnswers] = useState({});
  const [behavAnswers, setBehavAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("technical");
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [timerExpired, setTimerExpired] = useState(false);
  const submitRef = useRef(null);

  useEffect(() => {
    if (interviewId) getReportById(interviewId);
  }, [interviewId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setTimerExpired(true);
      if (submitRef.current) submitRef.current();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading) return <div className="mi-loading"><div className="mi-spinner" />Loading questions...</div>;
  if (!interviewReport) return <div className="mi-loading">Report not found</div>;

  const technicalQuestions = interviewReport.technicalQuestions || [];
  const behavioralQuestions = interviewReport.behavioralQuestions || [];
  const totalQuestions = technicalQuestions.length + behavioralQuestions.length;
  const answeredCount = Object.values(techAnswers).filter(a => a?.trim()).length +
    Object.values(behavAnswers).filter(a => a?.trim()).length;

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit) {
      const unansweredTech = technicalQuestions.filter((_, i) => !techAnswers[i]?.trim());
      const unansweredBehav = behavioralQuestions.filter((_, i) => !behavAnswers[i]?.trim());
      if (unansweredTech.length > 0 || unansweredBehav.length > 0) {
        setError(`Please answer all ${totalQuestions} questions before submitting.`);
        return;
      }
    }

    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        technicalQuestions: technicalQuestions.map((q, i) => ({
          question: q.question,
          answer: techAnswers[i] || "No answer provided",
        })),
        behavioralQuestions: behavioralQuestions.map((q, i) => ({
          question: q.question,
          answer: behavAnswers[i] || "No answer provided",
        })),
      };

      const data = await evaluateMockInterviewApi(interviewId, payload);
      sessionStorage.setItem(`mock-result-${interviewId}`, JSON.stringify(data.evaluation));
      navigate(`/mock-result/${interviewId}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong during evaluation.");
    } finally {
      setSubmitting(false);
    }
  };

  submitRef.current = () => handleSubmit(true);

  const timerColor = timeLeft <= 300 ? "#ef4444" : timeLeft <= 600 ? "#f97316" : "#185FA5";

  return (
    <div className="mi-root">
      <Background />

      {/* countdown timer */}
      <div style={{
        position: "fixed",
        top: "16px",
        right: "24px",
        background: timerColor,
        color: "white",
        padding: "10px 20px",
        borderRadius: "10px",
        fontWeight: "bold",
        fontSize: "22px",
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "background 0.3s"
      }}>
        ⏱ {formatTime(timeLeft)}
        {timeLeft <= 300 && <span style={{fontSize:"14px"}}>⚠ Hurry up!</span>}
      </div>

      {/* Timer expired overlay */}
      {timerExpired && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.8)",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "white",
          fontSize: "24px",
          fontWeight: "bold"
        }}>
          <div>⏰ Time's up! Submitting your answers...</div>
          <div style={{fontSize:"16px", marginTop:"12px", opacity:0.7}}>Please wait...</div>
        </div>
      )}

      {/* Navbar */}
      <nav className="mi-nav">
        <div className="mi-nav__brand">
          <MocklyLogo />
        </div>
        <button className="mi-nav__back" onClick={() => navigate(`/interview/${interviewId}`)}>
          ← Back to Report
        </button>
      </nav>

      <div className="mi-wrap">
        <div className="mi-header">
          <p className="mi-subtitle">
            Answer all {totalQuestions} questions honestly — your responses will be evaluated by AI.
          </p>
          <div className="mi-progress-bar">
            <div className="mi-progress-fill" style={{ width: `${(answeredCount / totalQuestions) * 100}%` }} />
          </div>
          <p className="mi-progress-text">{answeredCount} / {totalQuestions} answered</p>
        </div>

        <div className="mi-section-tabs">
          <button
            className={`mi-section-tab ${activeSection === "technical" ? "active" : ""}`}
            onClick={() => setActiveSection("technical")}
          >
            ⚙️ Technical <span className="mi-tab-count">{technicalQuestions.length}</span>
          </button>
          <button
            className={`mi-section-tab ${activeSection === "behavioral" ? "active" : ""}`}
            onClick={() => setActiveSection("behavioral")}
          >
            🧠 Behavioral <span className="mi-tab-count">{behavioralQuestions.length}</span>
          </button>
        </div>

        {activeSection === "technical" && (
          <div className="mi-questions">
            {technicalQuestions.map((q, i) => (
              <div className="mi-q-card" key={i}>
                <div className="mi-q-header">
                  <span className="mi-q-num">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mi-q-text">{q.question}</p>
                  {techAnswers[i]?.trim() && <span className="mi-q-done">✓</span>}
                </div>
                <textarea
                  className="mi-answer-input"
                  placeholder="Type your answer here..."
                  value={techAnswers[i] || ""}
                  onChange={(e) => setTechAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                  rows={5}
                />
                <div className="mi-char-count">{(techAnswers[i] || "").length} chars</div>
              </div>
            ))}
            <button className="mi-next-btn" onClick={() => setActiveSection("behavioral")}>
              Next: Behavioral Questions →
            </button>
          </div>
        )}

        {activeSection === "behavioral" && (
          <div className="mi-questions">
            {behavioralQuestions.map((q, i) => (
              <div className="mi-q-card" key={i}>
                <div className="mi-q-header">
                  <span className="mi-q-num mi-q-num--behav">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mi-q-text">{q.question}</p>
                  {behavAnswers[i]?.trim() && <span className="mi-q-done">✓</span>}
                </div>
                <textarea
                  className="mi-answer-input"
                  placeholder="Type your answer here..."
                  value={behavAnswers[i] || ""}
                  onChange={(e) => setBehavAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                  rows={5}
                />
                <div className="mi-char-count">{(behavAnswers[i] || "").length} chars</div>
              </div>
            ))}
            <button className="mi-prev-btn" onClick={() => setActiveSection("technical")}>
              ← Back to Technical
            </button>
          </div>
        )}

        {error && <div className="mi-error">⚠ {error}</div>}

        <button
          className={`mi-submit-btn ${submitting ? "is-loading" : ""}`}
          onClick={() => handleSubmit(false)}
          disabled={submitting}
        >
          {submitting ? (
            <><span className="mi-btn-spinner" /><span>Evaluating your answers...</span></>
          ) : (
            <><span>⚡</span><span>Submit & Get Results</span></>
          )}
        </button>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="mi-bg" aria-hidden="true">
      <div className="mi-orb mi-orb--a" />
      <div className="mi-orb mi-orb--b" />
      <div className="mi-orb mi-orb--c" />
      <div className="mi-grid" />
    </div>
  );
}