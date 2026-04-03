import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuthStore } from './store/authStore';
import './App.css';

const Home = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to myBlog</h1>
      {isAuthenticated ? (
        <div>
          <p className="mb-4">Hello, {user?.name || user?.email}!</p>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </Link>
          <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded">
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
