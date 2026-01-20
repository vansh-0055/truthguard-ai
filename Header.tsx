import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await signOut();
    const error = result.error;
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="TruthGuard AI"
              className="h-12 w-auto object-contain rounded-lg bg-white"
            />
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link to="/check" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Check News
            </Link>
            {user && (
              <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>



            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <User className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-1 px-3 py-2 text-sm bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;