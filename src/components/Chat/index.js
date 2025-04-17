import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./CSS/index.css";

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const API_URL = "https://rapid-grossly-raven.ngrok-free.app/gemini/ask"; // Replace with your actual backend endpoint

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setMessages((prev) => [...prev, { sender: "You", text: trimmedInput }]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: trimmedInput })
      });

      const data = await response.json();

      if (data?.response) {
        setMessages((prev) => [...prev, { sender: "Bot", text: data.response }]);
      } else {
        setError("No response from the server.");
      }
    } catch (err) {
      console.error("Error fetching response:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsTyping(false);
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
          onKeyPress={handleKeyPress}
        />
        <button
          className="send-button"
          onClick={sendMessage}
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};
