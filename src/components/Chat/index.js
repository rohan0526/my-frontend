import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import ReactMarkdown from "react-markdown";
import "./CSS/index.css";

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    const newSocket = io("https://rapid-grossly-raven.ngrok-free.app/", {
      path: "/socket.io",
      transports: ["websocket"],
      upgrade: false,
      query: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      extraHeaders: {
        "Authorization": `Bearer ${token}`
      }
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      setError(null);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
      
      if (error.message.includes("Authentication")) {
        setError("Authentication failed. Please log in again.");
        localStorage.removeItem("token");
        // You might want to use React Router here instead
        window.location.href = '/login';
      } else {
        setError("Failed to connect to chat server. Please try again later.");
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
      if (reason === "io server disconnect") {
        // Server initiated disconnect, need to reconnect manually
        newSocket.connect();
      }
      setError("Disconnected from chat server. Trying to reconnect...");
    });

    const handleAiResponse = (data) => {
      setIsTyping(false);
      if (data && data.response) {
        setMessages((prev) => [...prev, { sender: "Bot", text: data.response }]);
      }
    };

    newSocket.on("ai_response", handleAiResponse);
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.off("ai_response", handleAiResponse);
        newSocket.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (!isConnected) {
      setError("Not connected to chat server");
      return;
    }

    const trimmedInput = input.trim();
    if (trimmedInput !== "") {
      setMessages((prev) => [...prev, { sender: "You", text: trimmedInput }]);
      socket.emit("user_message", { query: trimmedInput });
      setInput("");
      setIsTyping(true);
      
      // Add timeout to hide typing indicator if no response received
      setTimeout(() => {
        setIsTyping(false);
      }, 30000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Financial Assistant</h2>
        <div className={`connection-status ${isConnected ? "connected" : ""}`}>
          {isConnected ? "Connected" : "Connecting..."}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message message bot">
            <div className="message-sender">Bot</div>
            <div className="message-content">
              👋 Hello! I'm your AI Financial Assistant. Feel free to ask me about:
              <ul>
                <li>Stock market analysis</li>
                <li>Trading strategies</li>
                <li>Portfolio management</li>
                <li>Financial terms and concepts</li>
              </ul>
            </div>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender.toLowerCase()}`}>
            <div className="message-sender">{msg.sender}</div>
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
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          className="chat-input"
          placeholder="Ask about stocks, trading strategies, or financial concepts..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={!isConnected}
        />
        <button 
          className="send-button"
          onClick={sendMessage}
          disabled={!isConnected || !input.trim()}
        >
          {isConnected ? "Send" : "Connecting..."}
        </button>
      </div>
    </div>
  );
};