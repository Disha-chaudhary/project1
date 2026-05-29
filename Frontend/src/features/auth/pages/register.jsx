import React from "react";
import "../auth.form.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";

function Register() {
    const navigate = useNavigate();
    const { loading, register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle registration logic here
        await handleRegister(name,email,password)
        navigate("/")
    }
    
    if(loading){
        return (<main>Loading...</main>);
    }
  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Register</h1>

        <input onChange={(e)=>{setName(e.target.value)}}
          type="text"
          placeholder="Enter your name"
        />

        <input onChange={(e)=>{setEmail(e.target.value)}}
          type="email"
          placeholder="Enter your email"
        />

        <input onChange={(e)=>{setPassword(e.target.value)}}
          type="password"
          placeholder="Enter your password"
        />

        <button type="submit">
          Register
        </button>
      </form>
    </div>
  )
}

export default Register;