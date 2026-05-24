function Register() {
    const handleSubmit = (e) => {
        e.preventDefault();
    }
  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Register</h1>

        <input
          type="text"
          placeholder="Enter your name"
        />

        <input
          type="email"
          placeholder="Enter your email"
        />

        <input
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