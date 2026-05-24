import React from 'react'
import '../auth.form.scss'

const login = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
    }
  return (
    <main > 
        <div className="formContainer">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="inputGrp">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder='Enter your email' />
                </div>
                <div className="inputGrp">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder='Enter your password' />
                </div>
                <button className="btn primary" type="submit">Login</button>
            </form>
        </div>
    </main>
  )
}

export default login