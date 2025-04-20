import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import './CSS/AuthPage.css';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-forms-container">
          <div className={`form-slider ${isLogin ? 'login-active' : 'signup-active'}`}>
            <LoginForm onToggleMode={() => setIsLogin(false)} />
            <SignupForm onToggleMode={() => setIsLogin(true)} />
          </div>
        </div>
      </div>
    </div>
  );
}; 
