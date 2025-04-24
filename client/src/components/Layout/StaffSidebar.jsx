// src/components/Layout/StaffSidebar.jsx
import { useContext, useState } from 'react';
import {
    FaBars,
    FaCalendarAlt,
    FaCalendarDay,
    FaChartBar,
    FaSignOutAlt,
    FaTachometerAlt,
    FaTimes,
    FaUser,
    FaUserClock
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const StaffSidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const sidebarLinks = [
    {
      path: '/staff',
      name: 'Dashboard',
      icon: <FaTachometerAlt className="w-5 h-5" />,
      exact: true
    },
    {
      path: '/staff/appointments',
      name: 'Appointments',
      icon: <FaCalendarAlt className="w-5 h-5" />
    },
    {
      path: '/staff/schedule',
      name: 'My Schedule',
      icon: <FaCalendarDay className="w-5 h-5" />
    },
    {
      path: '/staff/time-off',
      name: 'Time Off',
      icon: <FaUserClock className="w-5 h-5" />
    },
    {
      path: '/staff/reports',
      name: 'Reports',
      icon: <FaChartBar className="w-5 h-5" />
    }
  ];

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/staff' && location.pathname === '/staff') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/staff';
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-20 left-4 z-50 bg-secondary text-white p-3 rounded-md shadow-md"
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 w-64 bg-neutral-800 h-screen text-white transition-transform duration-300 ease-in-out transform z-30 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center">
            <img
              src="/src/assets/images/logo-white.png"
              alt="Beauty Haven"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-medium">Beauty Haven</h3>
              <p className="text-xs text-neutral-400">Staff Portal</p>
            </div>
          </div>
        </div>

        <div className="py-4">
          <div className="px-6 py-2 text-xs text-neutral-500 uppercase tracking-wider">
            Main
          </div>
          <nav>
            <ul>
              {sidebarLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center px-6 py-3 transition-colors ${
                      isActive(link.path)
                        ? 'bg-secondary text-white'
                        : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-6 py-2 mt-6 text-xs text-neutral-500 uppercase tracking-wider">
            Account
          </div>
          <ul>
            <li>
              <Link
                to="/staff/profile"
                className={`flex items-center px-6 py-3 transition-colors ${
                  location.pathname === '/staff/profile'
                    ? 'bg-secondary text-white'
                    : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
                }`}
                onClick={() => setIsMobileOpen(false)}
              >
                <FaUser className="w-5 h-5 mr-3" />
                My Profile
              </Link>
            </li>
            <li>
              <div className="px-6 py-3 text-neutral-400">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
                    <span className="uppercase font-medium text-sm">
                      {user?.firstName?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-xs">{user?.email}</div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-6 py-3 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
              >
                <FaSignOutAlt className="w-5 h-5 mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default StaffSidebar;
