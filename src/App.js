import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AuthPage } from './components/AuthPage';
import { HomePage } from './components/HomePage';
import { useAuth } from './context/AuthContext';

const AppContent = () => {
  const { user } = useAuth();
  console.log('Current user:', user);
  return user ? <HomePage /> : <AuthPage />;
};

export const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}; 
