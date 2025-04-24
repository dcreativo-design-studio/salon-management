// src/App.jsx
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles/global.css';

// Import contexts
import { AuthProvider } from './context/AuthContext';

// Import layout components
import Footer from './components/Layout/Footer';
import Navbar from './components/Layout/Navbar';

// Import public pages
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Services from './pages/Services';

// Auth pages
import ForgotPassword from './pages/Auth/ForgotPassword';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';

// Client pages
import ClientAppointments from './pages/Client/AppointmentHistory';
import ClientDashboard from './pages/Client/Dashboard';
import ClientProfile from './pages/Client/Profile';

// Booking pages
import BookingConfirmation from './pages/Booking/BookingConfirmation';
import BookingPage from './pages/Booking/BookingPage';

// Admin pages
import AdminAppointments from './pages/Admin/Appointments';
import AdminClients from './pages/Admin/Clients';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminServices from './pages/Admin/Services';
import AdminStaff from './pages/Admin/Staff';

// Staff pages
import StaffDashboard from './pages/Staff/Dashboard';
import StaffReports from './pages/Staff/Reports';
import StaffSchedule from './pages/Staff/Schedule';

// Import route guards
import AdminRoute from './components/common/AdminRoute';
import PrivateRoute from './components/common/PrivateRoute';
import StaffRoute from './components/common/StaffRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

              {/* Booking Routes */}
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/booking/confirmation/:id" element={<BookingConfirmation />} />

              {/* Client Routes (Protected) */}
              <Route path="/client" element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />
              <Route path="/client/profile" element={<PrivateRoute><ClientProfile /></PrivateRoute>} />
              <Route path="/client/appointments" element={<PrivateRoute><ClientAppointments /></PrivateRoute>} />

              {/* Admin Routes (Protected + Admin Role) */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />
              <Route path="/admin/staff" element={<AdminRoute><AdminStaff /></AdminRoute>} />
              <Route path="/admin/appointments" element={<AdminRoute><AdminAppointments /></AdminRoute>} />
              <Route path="/admin/clients" element={<AdminRoute><AdminClients /></AdminRoute>} />

              {/* Staff Routes (Protected + Staff Role) */}
              <Route path="/staff" element={<StaffRoute><StaffDashboard /></StaffRoute>} />
              <Route path="/staff/schedule" element={<StaffRoute><StaffSchedule /></StaffRoute>} />
              <Route path="/staff/reports" element={<StaffRoute><StaffReports /></StaffRoute>} />

              {/* Redirect for any unmatched routes */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="bottom-right" autoClose={5000} />
      </Router>
    </AuthProvider>
  );
};

export default App;
