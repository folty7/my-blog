import { Github, Linkedin, Instagram } from 'lucide-react';
import GridContainer from './GridContainer';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-v2">
      <GridContainer style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" className="logo" style={{ fontSize: '1.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Môj Blog
          </Link>

          <a href="mailto:andrejjozeffolta@gmail.com" className="mono-text" style={{ color: '#cda06b', textTransform: 'lowercase', fontSize: '0.9rem' }}>
            andrejjozeffolta@gmail.com
          </a>

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
            <a href="#" className="social-link"><Github size={20} /></a>
            <a href="#" className="social-link"><Linkedin size={20} /></a>
            <a href="#" className="social-link"><Instagram size={20} /></a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            <span>© 2026 Moj Blog Studio. All rights reserved.</span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <a href="#" style={{ transition: 'color 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Privacy Policy</a>
            <a href="#" style={{ transition: 'color 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Terms of Service</a>
          </div>
        </div>
      </GridContainer>
    </footer>
  );
}
