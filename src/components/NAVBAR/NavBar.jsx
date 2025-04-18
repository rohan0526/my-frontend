import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';
import { ReactComponent as LogoSVG } from '../../assets/logo.svg';
import { useAuth } from '../../context/AuthContext';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  
  useEffect(() => {
    // Get token and userId from localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.user_id) {
          setUserId(userData.user_id);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setShowDropdown(false);
  };
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
  const goToProfile = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <LogoSVG className="logo-svg" />
          <span className="logo-text">FinGenius</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            Home
          </Link>
          <Link to="/chat" className={`nav-link ${isActive('/chat')}`}>
            AI Assistant
          </Link>
          <Link to="/tradingview" className={`nav-link ${isActive('/tradingview')}`}>
            Trading View
          </Link>
          <Link to="/games" className={`nav-link ${isActive('/games')}`}>
            Finance Games
          </Link>
        </div>
        
        <div className="user-section">
          <div className="profile-wrapper">
            <div className="profile-icon" onClick={toggleDropdown}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#4a63e7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#4a63e7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {showDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">User Profile</div>
                <div className="user-details">
                  <div className="user-detail">
                    <span className="detail-label">Token:</span>
                    <span className="detail-value">{token ? `${token.substring(0, 12)}...` : "Not available"}</span>
                  </div>
                  <div className="user-detail">
                    <span className="detail-label">ID:</span>
                    <span className="detail-value">{userId || "Not available"}</span>
                  </div>
                  {user && (
                    <div className="user-detail">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{user.email || "Not available"}</span>
                    </div>
                  )}
                </div>
                <div className="dropdown-actions">
                  <button className="profile-button" onClick={goToProfile}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#4a63e7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#4a63e7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    View Profile
                  </button>
                  <button className="logout-button-dropdown" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 17L21 12L16 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar; 