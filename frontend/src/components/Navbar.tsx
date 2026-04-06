import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, Rocket, Menu, X, BookOpen, UserCircle, Briefcase, Mail, Github, Twitter, Linkedin } from 'lucide-react';
import GridContainer from './GridContainer';
import { AnimatePresence, motion } from 'framer-motion';

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
        <GridContainer showPattern={true} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px', padding: '0 2rem' }}>
          <Link to="/" className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Môj Blog
          </Link>

          <ul className="nav-links">
            <li>
              <Menu size={24} style={{ color: 'var(--text-main)', cursor: 'pointer' }} onClick={toggleDrawer} />
            </li>
          </ul>
        </GridContainer>
      </nav>

      {/* Drawer Menu Overlay */}
      <AnimatePresence mode="wait">
        {isDrawerOpen && (
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleDrawer}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}
          >
            <motion.div
              className="drawer-content"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-card)', height: '100%', borderLeft: '1px solid var(--border-color)', padding: '2.5rem', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}
            >
              <div className="drawer-header">
                <span className="logo" style={{ fontSize: '1.25rem' }}>Fox Studio</span>
                <X size={24} style={{ cursor: 'pointer', color: 'var(--text-main)' }} onClick={toggleDrawer} />
              </div>

              <div className="drawer-links">
                {isAuthenticated ? (
                  <>
                    <div className="drawer-user-pill" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', marginBottom: '2rem', borderRadius: '4px' }}>
                      <User size={20} color="var(--primary)" />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="mono-text" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Logged in as</span>
                        <span style={{ fontWeight: 600 }}>{user?.name}</span>
                      </div>
                    </div>

                    <Link to="/" onClick={toggleDrawer} className="drawer-link">
                      <BookOpen size={20} /> <span>Browse Blog</span>
                    </Link>
                    <Link to="/dashboard" onClick={toggleDrawer} className="drawer-link">
                      <Briefcase size={20} /> <span>My Dashboard</span>
                    </Link>
                    <Link to="/create-post" onClick={toggleDrawer} className="drawer-link" style={{ color: 'var(--primary)' }}>
                      <Rocket size={20} /> <span>Write New Post</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="drawer-link"
                      style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--border-subtle)', width: '100%', cursor: 'pointer', textAlign: 'left', color: '#ef4444' }}
                    >
                      <LogOut size={20} /> <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/" onClick={toggleDrawer} className="drawer-link">
                      <BookOpen size={20} /> <span>Blog Home</span>
                    </Link>
                    <Link to="/login" onClick={toggleDrawer} className="drawer-link">
                      <User size={20} /> <span>Sign In</span>
                    </Link>
                    <Link to="/register" onClick={toggleDrawer} className="drawer-link">
                      <Rocket size={20} /> <span>Join the Studio</span>
                    </Link>
                  </>
                )}

                <div style={{ marginTop: '3rem' }}>
                  <a href="#" className="drawer-link" style={{ fontSize: '1rem', opacity: 0.6 }}>
                    <Mail size={18} /> <span>Support & Contact</span>
                  </a>
                </div>
              </div>

              <div className="drawer-footer">
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <a href="#" className="social-link" style={{ color: 'var(--text-muted)' }}><Github size={18} /></a>
                  <a href="#" className="social-link" style={{ color: 'var(--text-muted)' }}><Twitter size={18} /></a>
                  <a href="#" className="social-link" style={{ color: 'var(--text-muted)' }}><Linkedin size={18} /></a>
                </div>
                <p className="subtitle" style={{ fontSize: '0.75rem', textAlign: 'center' }}>© 2026 Moj Blog Studio.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
