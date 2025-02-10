import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CSS/LoginForm.css';

export const LoginForm = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(formData.email, formData.password);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="login-form-container">
      <h2 className="login-form-heading">Login</h2>

      {error && <div className="login-form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="login-form-input"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="login-form-input"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="login-form-button"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <a
        onClick={onToggleMode}
        className="login-form-toggle"
      >
        Don't have an account? Sign up
      </a>
    </div>
  );
}; 