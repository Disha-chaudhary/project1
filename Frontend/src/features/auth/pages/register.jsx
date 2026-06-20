import React, { useState } from "react";
import "../auth.form.scss";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

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

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <MocklyLogo />

        <h1>Register</h1>

        {error && <p className="error">{error}</p>}

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Enter your name"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter your password"
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;