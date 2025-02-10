import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome {user?.email}</h1>
        <p className="text-gray-600 mb-8">You are now logged in to your account.</p>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}