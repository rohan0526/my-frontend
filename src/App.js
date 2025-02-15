import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthPage } from "./components/AuthPage";
import { HomePage } from "./components/HomePage";
import { Chat } from "./components/Chat";
import { PaperTrading } from "./components/PaperTrading";
import { TradingView } from "./components/TradingView";


const AppContent = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
      <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
      <Route path="/chat" element={user ? <Chat /> : <Navigate to="/auth" />} />
      <Route path="/papertrading" element={user ? <PaperTrading /> : <Navigate to="/auth" />} />
      <Route path="/tradingview" element={user ? <TradingView /> : <Navigate to="/auth" />} />
    </Routes>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};