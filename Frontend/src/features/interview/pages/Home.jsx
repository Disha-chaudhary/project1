import { useState, useRef } from "react";
import "../home.scss";
import { useInterview } from "../hooks/useinterview";
import { useNavigate, Link } from "react-router-dom";
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

const FloatingCard = ({ className, icon, label }) => (
  <div className={`float-card ${className}`}>
    <span className="float-card__icon">{icon}</span>
    {label && <span className="float-card__label">{label}</span>}
  </div>
);

export default function Home() {
  const { loading, createReport } = useInterview();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const resumeInputRef = useRef(null);

  const pickFile = (f) => { if (f) setResume(f); };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setResume(f);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const submit = async () => {
    try {
      setError(null);
      if (!jobDescription.trim()) {
        setError("Job description is required.");
        return;
      }
      if (!resume) {
        setError("Resume PDF is required.");
        return;
      }
      const report = await createReport({
        jobDescription,
        selfDescription,
        resumeFile: resume,
      });
      navigate(`/mock-interview/${report._id}`);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to generate interview report");
    }
  };

  return (
    <div className="page">
      <Background />

      <FloatingCard className="fc-tl" icon="🤖" label="AI Analysis" />
      <FloatingCard className="fc-tr" icon="📊" label="Score Card" />
      <FloatingCard className="fc-bl" icon="💬" label="Mock Interview" />
      <FloatingCard className="fc-br" icon="📄" label="Resume" />

      <header className="topbar">
        <div className="topbar__brand">
          <MocklyLogo />
        </div>
        <div className="topbar__pill">
          <span className="topbar__dot--live" />
          AI-powered prep
        </div>
        <button onClick={handleLogout} className="topbar__logout">
          Logout
        </button>
      </header>

      <div className="page-heading">
        <h1>Generate Your <em>Interview Report</em></h1>
        <p>Paste a job description, upload your resume, and get a tailored prep report in seconds.</p>
      </div>

      <div className="form-shell">
        <section className="panel panel--left">
          <label className="panel__label">
            <span className="panel__label-icon">📋</span>
            Job Description
            <span className="panel__label-required">required</span>
          </label>
          <textarea
            className="jd-textarea"
            placeholder="Paste the full job posting here — role overview, responsibilities, required skills…"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            spellCheck={false}
          />
          <div className="panel__footer">
            <span className="char-count">{jobDescription.length} chars</span>
            {jobDescription.length > 0 && (
              <button className="clear-btn" onClick={() => setJobDescription("")}>Clear</button>
            )}
          </div>
        </section>

        <section className="panel panel--right">
          <div className="right-block">
            <label className="panel__label">
              <span className="panel__label-icon">📎</span>
              Resume
              <span className="panel__label-hint">optional · PDF, DOC, DOCX</span>
            </label>
            <div
              className={`drop-zone ${dragOver ? "drag-active" : ""} ${resume ? "has-file" : ""}`}
              onClick={() => resumeInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
            >
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={(e) => pickFile(e.target.files[0])}
              />
              {resume ? (
                <div className="drop-zone__preview">
                  <span className="drop-zone__preview-icon">✅</span>
                  <div className="drop-zone__preview-info">
                    <span className="drop-zone__preview-name">{resume.name}</span>
                    <span className="drop-zone__preview-size">{(resume.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button
                    className="drop-zone__remove"
                    onClick={(e) => { e.stopPropagation(); setResume(null); }}
                  >✕</button>
                </div>
              ) : (
                <div className="drop-zone__idle">
                  <span className="drop-zone__arrow">↑</span>
                  <span className="drop-zone__main">Drop your resume here</span>
                  <span className="drop-zone__sub">or click to browse</span>
                </div>
              )}
            </div>
          </div>

          <div className="right-block">
            <label className="panel__label">
              <span className="panel__label-icon">✍️</span>
              Self Description
              <span className="panel__label-hint">optional</span>
            </label>
            <textarea
              className="self-textarea"
              placeholder="A few lines about your background, experience level, and what you're looking for…"
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              spellCheck={false}
            />
          </div>

          {error && (
            <div className="error-banner">
              <span>⚠</span> {error}
            </div>
          )}

          <button
            className={`generate-btn ${loading ? "is-loading" : ""}`}
            onClick={submit}
            disabled={loading}
          >
            {loading ? (
              <><span className="generate-btn__spinner" /><span>Analysing…</span></>
            ) : (
              <><span className="generate-btn__glow" /><span className="generate-btn__icon">⚡</span><span>Generate & Start Mock Interview</span></>
            )}
          </button>

          <p className="generate-note">Best results with all three fields filled.</p>
        </section>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__orb bg__orb--a" />
      <div className="bg__orb bg__orb--b" />
      <div className="bg__orb bg__orb--c" />
      <div className="bg__grid" />
      <svg className="bg__lines" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <path d="M0 450 Q360 200 720 450 T1440 450" stroke="rgba(56,189,248,.06)" strokeWidth="1.5" fill="none"/>
        <path d="M0 500 Q360 750 720 500 T1440 500" stroke="rgba(129,140,248,.05)" strokeWidth="1" fill="none"/>
        <circle cx="720" cy="450" r="200" stroke="rgba(56,189,248,.04)" strokeWidth="1" fill="none"/>
        <circle cx="720" cy="450" r="320" stroke="rgba(129,140,248,.03)" strokeWidth="1" fill="none"/>
      </svg>
    </div>
  );
}