import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * Main layout component
 * Wraps all pages with navbar and common structure
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-savora-cream">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-savora-beige-100 border-t border-savora-beige-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-savora-brown-500">
            © 2026 SAVORA. Cook · Plan · Eat
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
