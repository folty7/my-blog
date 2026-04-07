import { Link } from 'react-router-dom';
import GridContainer from '../components/GridContainer';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <GridContainer
        wrapperClassName="hero-section"
        showPattern={true}
        style={{
          padding: '10rem 2rem',
          textAlign: 'center',
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div className="mono-text" style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
            Error 404 / Page Not Found
          </div>
          <h1 className="text-display" style={{ fontSize: '6rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
            Lost in the Code?
          </h1>
          <p className="subtitle" style={{ maxWidth: '600px', margin: '0 auto 3rem auto', textTransform: 'lowercase', lineHeight: '1.8' }}>
            the page you are looking for has been deleted, moved, or never existed in this repository. let's get you back to familiar territory.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/" className="btn-primary" style={{ padding: '1rem 2rem' }}>
              <Home size={18} />
              Return Home
            </Link>
            <Link 
              to="/dashboard" 
              className="btn-logout" 
              style={{ padding: '1rem 2rem', borderRadius: '50px' }}
            >
              <Search size={18} style={{ marginRight: '8px' }} />
              Go to Dashboard
            </Link>
          </div>
        </div>
      </GridContainer>

      <GridContainer style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="mono-text" style={{ opacity: 0.3 }}>
          // END OF STACK TRACE
        </div>
      </GridContainer>
    </div>
  );
}
