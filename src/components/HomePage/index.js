import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CSS/index.css';
import { User, Settings, Home, HelpCircle, LogOut, Trash2, PenLine } from 'lucide-react';

export const HomePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isWriting, setIsWriting] = useState(false);
  const [postContent, setPostContent] = useState('');

  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <div className="welcome-card flex justify-center items-center min-h-[calc(100vh-140px)]">
            {!isWriting ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div 
                  className="flex justify-center items-center cursor-pointer hover:bg-gray-100 rounded-full w-14 h-14 transition-colors duration-200"
                  onClick={() => setIsWriting(true)}
                >
                  <PenLine size={28} className="text-gray-600" />
                </div>
                <p className="text-gray-500 mt-2 text-sm">Click to create a post</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg w-[800px]">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-500" />
                    </div>
                    <div className="text-sm font-medium text-gray-700">{user?.email}</div>
                  </div>
                </div>
                <div className="p-4">
                  <textarea
                    className="w-full resize-none p-4 h-[200px] text-gray-700 text-lg placeholder-gray-400 focus:outline-none text-center"
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingTop: '80px'
                    }}
                  />
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end items-center bg-gray-50 rounded-b-xl">
                  <div className="flex space-x-4">
                    <button
                      className="px-8 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-200"
                      onClick={() => {
                        setIsWriting(false);
                        setPostContent('');
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-8 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                      onClick={() => {
                        // Handle post submission here
                        setIsWriting(false);
                        setPostContent('');
                      }}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}
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
      {/* Rest of the code remains the same */}
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
      
      <div className="main-content">
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
        
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};