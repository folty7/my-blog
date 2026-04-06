import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const hideFooter = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="main-content">
        {children}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}
