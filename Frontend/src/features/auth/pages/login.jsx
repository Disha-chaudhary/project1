import React, { useState } from "react";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth.js";
import {useNavigate} from "react-router-dom";

const Login = () => {
  const { loading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate("/");
  };

  if (loading) {
    return (
      <main>
        <h1>loading...</h1>
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
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="inputGrp">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="Enter your password"
            />
          </div>

          <button className="btn primary" type="submit">
            Login
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;