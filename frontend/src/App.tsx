import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:slug" element={<PostDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/create-post" element={<CreatePostPage />} />
              <Route path="/edit-post/:id" element={<EditPostPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* 404 Page (Optional) */}
            <Route path="*" element={<div className="container py-12 text-center">404 - Page Not Found</div>} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2026 MyBlog • Built with React & Node.js</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
