import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CSS/SignupForm.css';

export const SignupForm = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { signup, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = await signup(formData.email, formData.password);
    if (result.success) {
      onToggleMode(); // Switch to login form after successful signup
    } else {
      setError(result.error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="signup-form-container">
      <h2 className="signup-form-heading">Sign Up</h2>
      {error && <div className="signup-form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="signup-form-input"
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
            className="signup-form-input"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            className="signup-form-input"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="signup-form-button"
        >
         <h class="text"> {loading ? 'Loading...' : 'Sign Up'} </h>
        </button>
      </form>
      <button
        onClick={onToggleMode}
        className="signup-form-toggle"
      >
        <span className="redirect">Already have an account? Login</span>
      </button>
    </div>
  );
};
