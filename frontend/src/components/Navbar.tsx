import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, Rocket, Menu, X, BookOpen, UserCircle, Briefcase, Mail } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsDrawerOpen(false);
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Môj Blog
          </Link>

          <ul className="nav-links">
            {isAuthenticated ? (
              <>
                <li><Link to="/dashboard" className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>Dashboard</Link></li>
                <li>
                  <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    <User size={14} /> <span>{user?.name}</span>
                  </div>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn-logout" title="Log out">
                    <LogOut size={18} />
                  </button>
                </li>
                <li>
                  <Link to="/create-post" className="btn-primary">
                    <Rocket size={16} /> <span>Write Post</span>
                  </Link>
                </li>
                <li>
                  <Menu size={20} style={{ color: 'var(--text-main)', cursor: 'pointer' }} onClick={toggleDrawer} />
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>Login</Link></li>
                <li>
                  <Link to="/register" className="btn-primary">
                    <Rocket size={16} /> <span>Join Us</span>
                  </Link>
                </li>
                <li>
                  <Menu size={20} style={{ color: 'var(--text-main)', cursor: 'pointer' }} onClick={toggleDrawer} />
                </li>
              </>
            )}
          </ul>
          <div className="grid-intersection left" style={{ bottom: '-5px' }}></div>
          <div className="grid-intersection right" style={{ bottom: '-5px' }}></div>
        </div>
      </nav>

      {/* Drawer Menu Overlay */}
      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={toggleDrawer}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="logo" style={{ fontSize: '1.25rem' }}>Fox Studio</span>
              <X size={24} style={{ cursor: 'pointer', color: 'var(--text-main)' }} onClick={toggleDrawer} />
            </div>

            <div className="drawer-links">
              <Link to="/" onClick={toggleDrawer} className="drawer-link">
                <BookOpen size={20} /> <span>Blog</span>
              </Link>
              <Link to="/dashboard" onClick={toggleDrawer} className="drawer-link">
                <UserCircle size={20} /> <span>Account</span>
              </Link>
              <a href="#" onClick={(e) => e.preventDefault()} className="drawer-link">
                <Briefcase size={20} /> <span>Services</span>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="drawer-link">
                <Mail size={20} /> <span>Contact</span>
              </a>

              <div style={{ marginTop: '2rem' }}>
                <button className="btn-primary" style={{ width: '100%' }}>
                  <Rocket size={18} />
                  <span>Book a Free Consult</span>
                </button>
              </div>
            </div>

            <div className="drawer-footer">
              <p className="subtitle" style={{ fontSize: '0.75rem', textAlign: 'center' }}>© 2026 Moj Blog Studio. All rights reserved.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
