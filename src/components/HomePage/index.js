import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./CSS/index.css";
import { User, Settings, Home, HelpCircle, LogOut, Trash2, PenLine, Cpu, X, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    if (activeTab === "paper-trading") {
      navigate("/papertrading");
    }
  }, [activeTab, navigate]);

  useEffect(() => {
    if (activeTab === "trading-view") {
      navigate("/tradingview");
    }
  }, [activeTab, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
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
                  />
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end items-center bg-gray-50 rounded-b-xl">
                  <button
                    className="px-8 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                    onClick={() => {
                      setIsWriting(false);
                      setPostContent("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-8 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium"
                    onClick={() => {
                      // Handle post submission
                      setIsWriting(false);
                      setPostContent("");
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        );
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
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header" onClick={() => setActiveTab("profile")}>
          <User size={40} />
        </div>
        <ul>
          <li className={activeTab === "home" ? "active" : ""} onClick={() => setActiveTab("home")}>
            <Home className="inline-block mr-2" /> Home
          </li>
          <li className={activeTab === "paper-trading" ? "active" : ""} onClick={() => setActiveTab("paper-trading")}>
            <Cpu className="inline-block mr-2" /> Paper Trading
          </li>
          <li className={activeTab === "trading-view" ? "active" : ""} onClick={() => setActiveTab("trading-view")}>
            <Cpu className="inline-block mr-2" /> Trading View
          </li>
          <li className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            <User className="inline-block mr-2" /> Profile
          </li>
          <li className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
            <Settings className="inline-block mr-2" /> Settings
          </li>
        </ul>
      </aside>

      <div className="main-content">
        <header className="top-bar">
          <div className="user-profile-icon cursor-pointer" onClick={() => setActiveTab("profile")}>
            <User size={24} />
          </div>
          <span className="user-info">Welcome, {user?.email}</span>
        </header>

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
    </div>
  );
};
