import React, { useState } from "react";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { loading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await login(email, password);

      navigate("/");
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Login failed. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main>
      <div className="formContainer">
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
            <p
              style={{
                color: "red",
                marginBottom: "10px",
              }}
            >
              {error}
            </p>
          )}

          <button
            className="btn primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p
            style={{
              marginTop: "15px",
              textAlign: "center",
            }}
          >
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Login;