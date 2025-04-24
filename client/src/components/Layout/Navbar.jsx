// src/components/Layout/Navbar.jsx
import { useContext, useEffect, useState } from 'react';
import { FaBars, FaCalendarAlt, FaSignOutAlt, FaTimes, FaUser } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Handle profile dropdown toggle
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/src/assets/images/logo.png"
            alt="Beauty Haven Salon"
            className="h-12 md:h-14"
          />
          <div className={`ml-3 font-serif transition-colors duration-300 ${
            isScrolled ? 'text-primary-dark' : 'text-primary'
          }`}>
            <h1 className="text-xl md:text-2xl font-bold mb-0 leading-none">Beauty Haven</h1>
            <p className="text-xs text-neutral-600 mb-0">LUXURY HAIR SALON</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <ul className="flex space-x-8">
            <li>
              <Link
                to="/"
                className={`font-medium hover:text-primary transition-colors ${
                  location.pathname === '/' ? 'text-primary' : 'text-neutral-700'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className={`font-medium hover:text-primary transition-colors ${
                  location.pathname === '/services' ? 'text-primary' : 'text-neutral-700'
                }`}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`font-medium hover:text-primary transition-colors ${
                  location.pathname === '/about' ? 'text-primary' : 'text-neutral-700'
                }`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`font-medium hover:text-primary transition-colors ${
                  location.pathname === '/contact' ? 'text-primary' : 'text-neutral-700'
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Auth/Profile Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 text-primary-dark px-4 py-2 rounded-full transition-colors"
              >
                <FaUser className="text-sm" />
                <span className="font-medium">{user?.firstName || 'Account'}</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  {user?.role === 'staff' && (
                    <Link
                      to="/staff"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      Staff Dashboard
                    </Link>
                  )}

                  {user?.role === 'client' && (
                    <>
                      <Link
                        to="/client"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        My Dashboard
                      </Link>
                      <Link
                        to="/client/appointments"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        My Appointments
                      </Link>
                    </>
                  )}

                  <Link
                    to="/client/profile"
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                  >
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-neutral-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="font-medium text-neutral-700 hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-primary hover:bg-primary-dark text-white py-2 px-5 rounded-md transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
          <Link
            to="/booking"
            className="flex items-center space-x-2 bg-secondary hover:bg-secondary-dark text-white py-2 px-5 rounded-md transition-colors"
          >
            <FaCalendarAlt className="text-sm" />
            <span>Book Now</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-neutral-700 hover:text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 pt-20 pb-6 px-6 overflow-y-auto">
          <nav className="flex flex-col">
            <ul className="space-y-4 mb-8">
              <li>
                <Link
                  to="/"
                  className={`block text-lg font-medium ${
                    location.pathname === '/' ? 'text-primary' : 'text-neutral-700'
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className={`block text-lg font-medium ${
                    location.pathname === '/services' ? 'text-primary' : 'text-neutral-700'
                  }`}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`block text-lg font-medium ${
                    location.pathname === '/about' ? 'text-primary' : 'text-neutral-700'
                  }`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`block text-lg font-medium ${
                    location.pathname === '/contact' ? 'text-primary' : 'text-neutral-700'
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>

            <div className="space-y-4">
              <Link
                to="/booking"
                className="flex items-center justify-center space-x-2 bg-secondary w-full hover:bg-secondary-dark text-white py-3 px-5 rounded-md transition-colors"
              >
                <FaCalendarAlt />
                <span>Book Appointment</span>
              </Link>

              {isAuthenticated ? (
                <div className="space-y-3">
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block w-full text-center py-2 text-neutral-700 bg-neutral-100 rounded-md"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  {user?.role === 'staff' && (
                    <Link
                      to="/staff"
                      className="block w-full text-center py-2 text-neutral-700 bg-neutral-100 rounded-md"
                    >
                      Staff Dashboard
                    </Link>
                  )}

                  {user?.role === 'client' && (
                    <>
                      <Link
                        to="/client"
                        className="block w-full text-center py-2 text-neutral-700 bg-neutral-100 rounded-md"
                      >
                        My Dashboard
                      </Link>
                      <Link
                        to="/client/appointments"
                        className="block w-full text-center py-2 text-neutral-700 bg-neutral-100 rounded-md"
                      >
                        My Appointments
                      </Link>
                    </>
                  )}

                  <Link
                    to="/client/profile"
                    className="block w-full text-center py-2 text-neutral-700 bg-neutral-100 rounded-md"
                  >
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center space-x-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Link
                    to="/login"
                    className="w-1/2 text-center bg-neutral-100 text-neutral-700 py-3 rounded-md"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-1/2 text-center bg-primary hover:bg-primary-dark text-white py-3 rounded-md transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
