import React, { useState } from "react";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

const MocklyLogo = () => (
  <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "24px" }}>
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

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <div className="formContainer">
        <MocklyLogo />

        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="inputGrp">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="inputGrp">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </p>
          )}

          <button className="btn primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p style={{ marginTop: "15px", textAlign: "center" }}>
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Login;