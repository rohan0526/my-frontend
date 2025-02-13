import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import ReactMarkdown from "react-markdown";
import "./CSS/index.css";  // Ensure CSS is imported

const socket = io("https://rapid-grossly-raven.ngrok-free.app/", {
  path: "/socket.io",
  transports: ["websocket", "polling"],
});

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected with id:", socket.id);
    });

    const handleAiResponse = (data) => {
      console.log("Received message:", data);
      setMessages((prev) => [...prev, { sender: "Bot", text: data.response }]);
    };

    socket.on("ai_response", handleAiResponse);

    return () => {
      socket.off("ai_response", handleAiResponse);
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "") {
      setMessages((prev) => [...prev, { sender: "You", text: input }]);
      socket.emit("user_message", { query: input });
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chat with AI Financial Expert</div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender.toLowerCase()}`}>
            <b>{msg.sender}:</b> <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask a financial question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="send-button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};