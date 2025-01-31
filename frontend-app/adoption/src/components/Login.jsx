import React, { useState } from 'react';
import './Login.css';

export default ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('adoption_token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        onLoginSuccess(data.token, data);
      } else {
        setErrorMsg(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setErrorMsg('Login failed. Please try again.');
    }
  }

  return (
    <div className="login-container">
      <h2 className="login-title">Adoption - Please Log In</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMsg && <p className="login-error">{errorMsg}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
