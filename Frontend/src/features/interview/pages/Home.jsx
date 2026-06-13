import { useState, useRef } from "react";
import "../home.scss";
import { useInterview } from "../hooks/useinterview";
import { useNavigate } from "react-router-dom";

// ── Floating ambient cards ────────────────────────────────────────────────────
const FloatingCard = ({ className, icon, label }) => (
  <div className={`float-card ${className}`}>
    <span className="float-card__icon">{icon}</span>
    {label && <span className="float-card__label">{label}</span>}
  </div>
);

// ── Report result section ─────────────────────────────────────────────────────
const ReportSection = ({ report, onReset }) => {
  const sections = typeof report === "string"
    ? [{ title: "Interview Report", content: report }]
    : Object.entries(report).map(([k, v]) => ({
        title: k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        content: typeof v === "object" ? JSON.stringify(v, null, 2) : String(v),
      }));

  return (
    <div className="report-wrap">
      <div className="report-topbar">
        <div className="report-topbar__left">
          <span className="report-topbar__dot" />
          <span className="report-topbar__dot" />
          <span className="report-topbar__dot" />
          <span className="report-topbar__title">Interview Report Generated</span>
        </div>
        <button className="report-reset" onClick={onReset}>↩ New Report</button>
      </div>
      <div className="report-grid">
        {sections.map((s, i) => (
          <div className="report-card" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="report-card__header">{s.title}</div>
            <pre className="report-card__body">{s.content}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export default function Home() {

  const {loading,createReport} = useInterview();
 
  const navigate = useNavigate();
  const [jobDescription, setJobDescription]   = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume]                   = useState(null);
  const [dragOver, setDragOver]               = useState(false);
  
  const [error, setError]                     = useState(null);
  const [report, setReport]                   = useState(null);
  const resumeInputRef = useRef(null);

  

  const pickFile = f => { if (f) setResume(f); };

  const handleDrop = e => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setResume(f);
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

    navigate(`/interview/${report._id}`);
  } catch (e) {
    setError(
      e?.response?.data?.message ||
      "Failed to generate interview report"
    );
  }
};

  if (report) return (
    <div className="page">
      <Background />
      <ReportSection report={report} onReset={() => { setReport(null); setError(null); }} />
    </div>
  );

  return (
    
    <div className="page">
      <Background />

      {/* Ambient floating elements */}
      <FloatingCard className="fc-tl" icon="🤖" label="AI Analysis" />
      <FloatingCard className="fc-tr" icon="📊" label="Score Card" />
      <FloatingCard className="fc-bl" icon="💬" label="Mock Interview" />
      <FloatingCard className="fc-br" icon="📄" label="Resume" />

      {/* ── Compact header ── */}
      <header className="topbar">
        <div className="topbar__brand">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <polygon points="11,2 20,7 20,15 11,20 2,15 2,7" stroke="url(#g1)" strokeWidth="1.5" fill="none"/>
            <polygon points="11,6 16,9 16,13 11,16 6,13 6,9" fill="url(#g1)" opacity=".35"/>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="22" y2="22">
                <stop offset="0%" stopColor="#38bdf8"/>
                <stop offset="100%" stopColor="#818cf8"/>
              </linearGradient>
            </defs>
          </svg>
          <span>InterviewAI</span>
        </div>
        <div className="topbar__pill">
          <span className="topbar__dot--live" />
          AI-powered prep
        </div>
      </header>

      {/* ── Page title – compact ── */}
      <div className="page-heading">
        <h1>Generate Your <em>Interview Report</em></h1>
        <p>Paste a job description, upload your resume, and get a tailored prep report in seconds.</p>
      </div>

      {/* ── Two-column form ── */}
      <div className="form-shell">

        {/* LEFT – Job Description */}
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
            onChange={e => setJobDescription(e.target.value)}
            spellCheck={false}
          />
          <div className="panel__footer">
            <span className="char-count">{jobDescription.length} chars</span>
            {jobDescription.length > 0 && (
              <button className="clear-btn" onClick={() => setJobDescription("")}>Clear</button>
            )}
          </div>
        </section>

        {/* RIGHT – Resume + Self desc + CTA */}
        <section className="panel panel--right">

          {/* Resume upload */}
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
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
            >
              <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }}
                onChange={e => pickFile(e.target.files[0])} />
              {resume ? (
                <div className="drop-zone__preview">
                  <span className="drop-zone__preview-icon">✅</span>
                  <div className="drop-zone__preview-info">
                    <span className="drop-zone__preview-name">{resume.name}</span>
                    <span className="drop-zone__preview-size">{(resume.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button className="drop-zone__remove" onClick={e => { e.stopPropagation(); setResume(null); }}>✕</button>
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

          {/* Self description */}
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
              onChange={e => setSelfDescription(e.target.value)}
              spellCheck={false}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="error-banner">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Generate button */}
          <button
            className={`generate-btn ${loading ? "is-loading" : ""}`}
            onClick={submit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="generate-btn__spinner" />
                <span>Analysing…</span>
              </>
            ) : (
              <>
                <span className="generate-btn__glow" />
                <span className="generate-btn__icon">⚡</span>
                <span>Generate Interview Report</span>
              </>
            )}
          </button>

          <p className="generate-note">Best results with all three fields filled.</p>
        </section>
      </div>
    </div>
  );
}

// ── Background layer (extracted to avoid re-renders) ─────────────────────────
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
