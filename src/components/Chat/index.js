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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        <h2>Chat with AI Financial Expert</h2>
        <div className={`connection-status ${isConnected ? "connected" : ""}`}>
          {isConnected ? "Connected" : "Connecting..."}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender.toLowerCase()}`}>
            <div className="message-sender">{msg.sender}</div>
            <div className="message-content">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          className="chat-input"
          placeholder="Ask a financial question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
        />
        <button 
          className="send-button"
          onClick={sendMessage}
          disabled={!isConnected || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};