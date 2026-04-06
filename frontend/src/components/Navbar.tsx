import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, PenLine } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          MyBlog <span>.fullstack</span>
        </Link>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/create-post" className="btn-icon">
                  <PenLine size={18} /> <span>Write</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="btn-icon">
                  <User size={18} /> <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <div className="user-info">
                  <User size={18} /> <span>{user?.name}</span>
                </div>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  <LogOut size={18} />
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register" className="btn-primary">Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
