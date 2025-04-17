import React, { createContext, useState, useContext, useEffect } from 'react';
import io from "socket.io-client";

// Retrieve the JWT token from localStorage
let token = localStorage.getItem("token");

// If the token is "null" (string) or falsy, remove it
if (!token || token === "null") {
  token = null;
  console.error("No valid token found in localStorage");
}

console.log("JWT token from localStorage:", token);

const socket = io("https://rapid-grossly-raven.ngrok-free.app/", {
  path: "/socket.io",
  transports: ["websocket"],
  query: { token },
  auth: { token },
});
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
        const response = await fetch('https://rapid-grossly-raven.ngrok-free.app/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);  // Store only the token
        localStorage.setItem('user', JSON.stringify(data));  // Store user details if needed
        setUser(data);
        console.log(localStorage.getItem("token"));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    } finally {
        setLoading(false);
    }
};


  const signup = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('https://rapid-grossly-raven.ngrok-free.app/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Get user data from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const userId = userData.user_id;
        const token = localStorage.getItem('token');
        
        // Send logout request to backend
        await fetch('https://rapid-grossly-raven.ngrok-free.app/auth/logout', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ user_id: userId }),
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clean up client side regardless of server response
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      socket.disconnect(); // Disconnect from WebSocket
      setUser(null);
      window.location.reload(); // Reload to ensure user is logged out
    }
  };
  
  

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
