import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./CSS/index.css";
import { User, Settings, Home, HelpCircle, LogOut, Trash2, PenLine, Cpu, X, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StockNews from "../StockNews";

const QueryApp = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("https://rapid-grossly-raven.ngrok-free.app/gemini/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResponse(data.response || "No response received.");
    } catch (error) {
      setResponse("Error fetching response.");
    }

    setLoading(false);
  };

  return (
    <div className="query-container">
      <h1 className="query-title">AI Assistant</h1>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type your question here..."
        className="query-textarea"
      />
      <button onClick={sendQuery} disabled={loading}>
        {loading ? "Loading..." : "Submit"}
      </button>
      {response && (
        <div className="query-response">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export const HomePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [isWriting, setIsWriting] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const navigate = useNavigate();

  // Fetch portfolio data
  const fetchPortfolio = async () => {
    try {
      const response = await axios.get("https://rapid-grossly-raven.ngrok-free.app/trade/portfolio", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
      setPortfolio(response.data.portfolio || []);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    // Add user message to chat
    const userMessage = { sender: "You", text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    try {
      // Include portfolio data in the query
      const response = await axios.post("https://rapid-grossly-raven.ngrok-free.app/gemini/ask", {
        query: chatInput,
        portfolio: portfolio // Send portfolio data along with the query
      });

      setIsTyping(false);
      if (response.data.response) {
        setChatMessages(prev => [...prev, { sender: "Bot", text: response.data.response }]);
      }
    } catch (error) {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { sender: "Bot", text: "Sorry, I encountered an error." }]);
    }
  };

  useEffect(() => {
    if (activeTab === "ai-assistant") {
      navigate("/chat");
    }
  }, [activeTab, navigate]);

  useEffect(() => {
    if (activeTab === "trading-view") {
      navigate("/tradingview");
    }
  }, [activeTab, navigate]);

  const renderFinGeniusHomepage = () => {
    return (
      <div className="fingenius-homepage">
        {/* Enhanced Hero Section with Animation */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="animated-gradient">Welcome to FinGenius</h1>
            <p className="subtitle">Your Personal AI Financial Assistant</p>
            <p className="description">
              Make smarter financial decisions with our cutting-edge AI tools, real-time
              market insights, and interactive learning experiences.
            </p>
            <div className="hero-buttons">
              <button className="primary-button pulse-animation" onClick={() => setActiveTab("ai-assistant")}>
                Try AI Assistant
              </button>
              <button className="secondary-button" onClick={() => setActiveTab("trading-view")}>
                Start Trading
              </button>
            </div>
            {/* Add animated indicators */}
            <div className="market-indicators">
              <div className="indicator up">
                <span className="symbol">NASDAQ</span>
                <span className="value">+1.2%</span>
              </div>
              <div className="indicator up">
                <span className="symbol">S&P 500</span>
                <span className="value">+0.8%</span>
              </div>
              <div className="indicator down">
                <span className="symbol">DOW</span>
                <span className="value">-0.3%</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src="/images/financial-ai.png" alt="Financial AI" className="floating-animation" />
            <div className="glowing-orb"></div>
          </div>
        </section>

        {/* Colorful Stats Section - New Addition */}
        <section className="stats-section">
          <div className="stat-card purple">
            <h3>10,000+</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-card blue">
            <h3>$500M+</h3>
            <p>Analyzed Assets</p>
          </div>
          <div className="stat-card teal">
            <h3>95%</h3>
            <p>User Satisfaction</p>
          </div>
          <div className="stat-card orange">
            <h3>24/7</h3>
            <p>AI Support</p>
          </div>
        </section>

        {/* Enhanced Features Section with Icons */}
        <section className="features-section">
          <h2 className="section-title">Discover Our Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon ai-icon"></div>
              <h3>AI Financial Assistant</h3>
              <p>Get personalized financial advice and insights from our advanced AI.</p>
              <button className="feature-button" onClick={() => setActiveTab("ai-assistant")}>Try Now</button>
            </div>
            <div className="feature-card">
              <div className="feature-icon trading-icon"></div>
              <h3>Trading View</h3>
              <p>Analyze markets with professional-grade trading charts and tools.</p>
              <button className="feature-button" onClick={() => setActiveTab("trading-view")}>Start Trading</button>
            </div>
            <div className="feature-card">
              <div className="feature-icon news-icon"></div>
              <h3>Stock News</h3>
              <p>Stay updated with the latest market news and financial insights.</p>
              <button className="feature-button" onClick={() => setActiveTab("stock-news")}>Read News</button>
            </div>
            <div className="feature-card">
              <div className="feature-icon games-icon"></div>
              <h3>Finance Games</h3>
              <p>Learn financial concepts through interactive and fun games.</p>
              <button className="feature-button" onClick={() => setActiveTab("finance-games")}>Play Now</button>
            </div>
          </div>
        </section>

        {/* Improved How It Works Section */}
        <section className="how-it-works-section">
          <h2 className="section-title">How FinGenius Works</h2>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your account in seconds and set your financial goals.</p>
            </div>
            <div className="connector"></div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Connect</h3>
              <p>Link your financial accounts or explore market data.</p>
            </div>
            <div className="connector"></div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Get Insights</h3>
              <p>Receive AI-powered financial advice tailored to your needs.</p>
            </div>
            <div className="connector"></div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Take Action</h3>
              <p>Make informed decisions based on data-driven recommendations.</p>
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section className="testimonials-section">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonial-card highlighted">
            <div className="quote-mark">"</div>
            <p className="testimonial-text">
              FinGenius has completely transformed how I manage my investments. The AI
              recommendations have been spot on!
            </p>
            <div className="testimonial-author-box">
              <div className="testimonial-avatar"></div>
              <p className="testimonial-author">Sarah J., Investor</p>
            </div>
          </div>
          <div className="testimonial-navigation">
            <div className="nav-dot active"></div>
            <div className="nav-dot"></div>
            <div className="nav-dot"></div>
            <div className="nav-dot"></div>
          </div>
        </section>

        {/* Footer */}
        <footer className="fingenius-footer">
          <div className="footer-column">
            <h3>FinGenius</h3>
            <p>Your AI-powered financial assistant that helps you make smarter financial decisions.</p>
            <div className="social-icons">
              <div className="social-icon"></div>
              <div className="social-icon"></div>
              <div className="social-icon"></div>
            </div>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li onClick={() => setActiveTab("home")}>Home</li>
              <li onClick={() => setActiveTab("ai-assistant")}>AI Assistant</li>
              <li onClick={() => setActiveTab("trading-view")}>Trading View</li>
              <li>Stock News</li>
              <li>Finance Games</li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contact Us</h3>
            <p>support@fingenius.com</p>
            <p>+1 (123) 456-7890</p>
            <p>123 Finance Street, New York, NY</p>
          </div>
          <div className="footer-bottom">
            <p>© 2023 FinGenius. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return renderFinGeniusHomepage();
      case "profile":
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
      case "settings":
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
      case "stock-news":
        return <StockNews />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container no-sidebar">
      <header className="main-header">
        <div className="header-left">
          <div className="logo-container">
            <img src="/images/logo-small.png" alt="FinGenius" className="logo-img" />
            <span className="logo-text">FinGenius</span>
          </div>
        </div>
        
        <nav className="main-nav">
          <ul className="nav-links">
            <li className={activeTab === "home" ? "active" : ""} onClick={() => setActiveTab("home")}>
              Home
            </li>
            <li className={activeTab === "ai-assistant" ? "active" : ""} onClick={() => setActiveTab("ai-assistant")}>
              AI Assistant
            </li>
            <li className={activeTab === "trading-view" ? "active" : ""} onClick={() => setActiveTab("trading-view")}>
              Trading View
            </li>
            <li className={activeTab === "stock-news" ? "active" : ""} onClick={() => setActiveTab("stock-news")}>
              Stock News
            </li>
            <li className={activeTab === "finance-games" ? "active" : ""} onClick={() => setActiveTab("finance-games")}>
              Finance Games
            </li>
          </ul>
        </nav>
        
        <div className="header-right">
          {user ? (
            <div className="user-profile" onClick={() => setActiveTab("profile")}>
              <span className="user-name">{user.email}</span>
              <div className="user-avatar">
                <User size={20} />
              </div>
            </div>
          ) : (
            <button className="login-button" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </header>

      <div className="main-content full-width">
        <div className="content-area">{renderContent()}</div>

        {/* Chat Popup Button */}
        <button 
          className="chat-toggle-button"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <MessageCircle size={24} />
        </button>

        {/* Chat Popup Window */}
        {isChatOpen && (
          <div className="chat-popup">
            <div className="chat-popup-header">
              <h3>Financial Assistant</h3>
              <button onClick={() => setIsChatOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="chat-popup-messages">
              {chatMessages.length === 0 && (
                <div className="welcome-message">
                  <p>👋 Hello! I'm your AI Financial Assistant. I can help you with:</p>
                  <ul>
                    <li>Portfolio analysis</li>
                    <li>Stock market insights</li>
                    <li>Trading strategies</li>
                    <li>Financial concepts</li>
                  </ul>
                </div>
              )}
              
              {chatMessages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.sender.toLowerCase()}`}>
                  <div className="message-content">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>

            <div className="chat-popup-input">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything about your portfolio or finances..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>

      {/* Profile and Settings dropdown (can be shown when user clicks on profile) */}
      {activeTab === "profile" && (
        <div className="profile-dropdown">
          <div className="dropdown-option" onClick={() => setActiveTab("settings")}>
            <Settings size={16} />
            <span>Settings</span>
          </div>
          <div className="dropdown-option logout" onClick={logout}>
            <LogOut size={16} />
            <span>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
};
