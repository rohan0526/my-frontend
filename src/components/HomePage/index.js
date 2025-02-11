import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CSS/index.css';
import { User, Settings, Home, HelpCircle, LogOut, Trash2 } from 'lucide-react';

export const HomePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <div className="welcome-card">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p>Welcome to your personal dashboard. Navigate through different sections using the sidebar.</p>
          </div>
        );
      case 'profile':
        return (
          <div className="welcome-card">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{user?.email}</h2>
                <p>Registered Email</p>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="welcome-card">
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
            <div className="space-y-3">
              <div className="settings-option">
                <HelpCircle className="settings-icon" />
                <span>Help</span>
              </div>
              <div className="settings-option">
                <Settings className="settings-icon" />
                <span>About</span>
              </div>
              <div className="settings-option text-red-600">
                <LogOut className="settings-icon" />
                <span onClick={logout}>Logout</span>
              </div>
              <div className="settings-option text-red-600">
                <Trash2 className="settings-icon" />
                <span>Delete Profile</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div
            onClick={() => setActiveTab('profile')}>
            <User size={40}/>
          </div>
        </div>
        <ul>
          <li 
            className={activeTab === 'home' ? 'active' : ''} 
            onClick={() => setActiveTab('home')}
          >
            <Home className="inline-block mr-2" /> Home
          </li>
          <li 
            className={activeTab === 'profile' ? 'active' : ''} 
            onClick={() => setActiveTab('profile')}
          >
            <User className="inline-block mr-2" /> Profile
          </li>
          <li 
            className={activeTab === 'settings' ? 'active' : ''} 
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="inline-block mr-2" /> Settings
          </li>
        </ul>
      </aside>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <div 
            className="user-profile-icon cursor-pointer"
            onClick={() => setActiveTab('profile')}
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={24} />
            </div>
          </div>
          <span className="user-info">Welcome, {user?.email}</span>
        </header>
        
        {/* Content Area */}
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};