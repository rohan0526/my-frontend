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
  const [focusedField, setFocusedField] = useState(null);

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
  
  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div className="signup-form-container">
      <h2 className="signup-form-heading">Create Account</h2>
      {error && <div className="signup-form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className={`signup-form-input ${focusedField === 'email' ? 'focused' : ''}`}
            value={formData.email}
            onChange={handleChange}
            onFocus={() => handleFocus('email')}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className={`signup-form-input ${focusedField === 'password' ? 'focused' : ''}`}
            value={formData.password}
            onChange={handleChange}
            onFocus={() => handleFocus('password')}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            className={`signup-form-input ${focusedField === 'confirmPassword' ? 'focused' : ''}`}
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={() => handleFocus('confirmPassword')}
            onBlur={handleBlur}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="signup-form-button"
        >
          <span className="text">{loading ? 'Creating account...' : 'Sign Up'}</span>
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
