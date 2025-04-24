// src/pages/Client/Dashboard.jsx
import { useContext, useEffect, useState } from 'react';
import { FaCalendarAlt, FaClock, FaHistory, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { getMyAppointments } from '../../services/appointmentService';

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getMyAppointments({ upcoming: true, limit: 3 });
        setUpcomingAppointments(response.data);
      } catch (err) {
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time for display
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  return (
    <div className="pt-24 pb-16 bg-neutral-100 min-h-screen">
      <div className="container-custom">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-primary p-8 text-white">
            <h1 className="text-3xl font-serif font-bold mb-2">Welcome, {user?.firstName || 'Client'}!</h1>
            <p className="text-white/80">
              Manage your appointments and profile information from your personal dashboard.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="p-8">
            <h2 className="text-2xl font-serif font-semibold mb-6">Quick Actions</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/booking"
                className="flex flex-col items-center p-6 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                  <FaCalendarAlt size={24} />
                </div>
                <h3 className="text-lg font-medium mb-2">Book Appointment</h3>
                <p className="text-center text-neutral-600 text-sm">
                  Schedule a new appointment with your favorite stylist
                </p>
              </Link>

              <Link
                to="/client/appointments"
                className="flex flex-col items-center p-6 bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mb-4">
                  <FaHistory size={24} />
                </div>
                <h3 className="text-lg font-medium mb-2">Appointment History</h3>
                <p className="text-center text-neutral-600 text-sm">
                  View and manage your past and upcoming appointments
                </p>
              </Link>

              <Link
                to="/client/profile"
                className="flex flex-col items-center p-6 bg-accent/5 rounded-lg hover:bg-accent/10 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-accent/20 text-accent-dark flex items-center justify-center mb-4">
                  <FaUser size={24} />
                </div>
                <h3 className="text-lg font-medium mb-2">Profile Settings</h3>
                <p className="text-center text-neutral-600 text-sm">
                  Update your personal information and preferences
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-semibold">Upcoming Appointments</h2>
              <Link to="/client/appointments" className="text-primary hover:text-primary-dark font-medium">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                {error}
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <FaClock className="text-neutral-400 text-2xl" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Upcoming Appointments</h3>
                <p className="text-neutral-600 mb-6">
                  You don't have any appointments scheduled. Would you like to book one now?
                </p>
                <Link to="/booking" className="btn-primary">
                  Book an Appointment
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment._id} className="border border-neutral-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-medium mb-2">{appointment.service.name}</h3>
                        <p className="text-neutral-600 mb-4">
                          with {appointment.staff.userId?.firstName} {appointment.staff.userId?.lastName}
                          ({appointment.staff.title})
                        </p>
                        <div className="flex items-center text-neutral-500">
                          <FaCalendarAlt className="mr-2" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center text-neutral-500 mt-1">
                          <FaClock className="mr-2" />
                          <span>{formatTime(appointment.date)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize bg-primary/10 text-primary">
                          {appointment.status}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {appointment.service.duration} min
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <Link
                        to={`/client/appointments/${appointment._id}`}
                        className="btn-outline py-2 px-4 text-sm flex-1 text-center"
                      >
                        View Details
                      </Link>

                      {appointment.status === 'pending' || appointment.status === 'confirmed' ? (
                        <Link
                          to={`/client/appointments/${appointment._id}/cancel`}
                          className="py-2 px-4 text-sm border border-red-300 text-red-500 hover:bg-red-50 rounded-md transition-colors flex-1 text-center"
                        >
                          Cancel
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
