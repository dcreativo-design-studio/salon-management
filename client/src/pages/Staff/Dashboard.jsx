// src/pages/Staff/Dashboard.jsx
import { useContext, useEffect, useState } from 'react';
import { FaCalendarAlt, FaCalendarCheck, FaCalendarTimes, FaClipboardList, FaClock, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import StaffSidebar from '../../components/Layout/StaffSidebar';
import AuthContext from '../../context/AuthContext';
import { getStaffAppointments } from '../../services/appointmentService';
import { getStaffByUserId } from '../../services/staffService';

const StaffDashboard = () => {
  const { user } = useContext(AuthContext);
  const [staffInfo, setStaffInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        // Get staff information
        const staffRes = await getStaffByUserId(user.id);
        setStaffInfo(staffRes.data);

        // Fetch upcoming appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const appointmentsRes = await getStaffAppointments(staffRes.data._id, {
          upcoming: true,
          limit: 10
        });

        setAppointments(appointmentsRes.data);

        // Filter today's appointments
        const todayAppts = appointmentsRes.data.filter(appt => {
          const apptDate = new Date(appt.date);
          return apptDate.toDateString() === today.toDateString();
        });

        setTodayAppointments(todayAppts);

        // Calculate stats
        const upcomingCount = appointmentsRes.data.filter(appt =>
          appt.status === 'pending' || appt.status === 'confirmed'
        ).length;

        const completedRes = await getStaffAppointments(staffRes.data._id, {
          status: 'completed',
          limit: 1
        });

        const cancelledRes = await getStaffAppointments(staffRes.data._id, {
          status: 'cancelled',
          limit: 1
        });

        const noShowRes = await getStaffAppointments(staffRes.data._id, {
          status: 'no-show',
          limit: 1
        });

        setStats({
          upcoming: upcomingCount,
          completed: completedRes.pagination.total || 0,
          cancelled: cancelledRes.pagination.total || 0,
          noShow: noShowRes.pagination.total || 0
        });
      } catch (error) {
        console.error('Error fetching staff data:', error);
        toast.error('Failed to load staff dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchStaffData();
    }
  }, [user]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time for display
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-600';
      case 'completed':
        return 'bg-blue-100 text-blue-600';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      case 'no-show':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-purple-100 text-purple-600';
    }
  };

  // Calculate time until appointment
  const getTimeUntil = (dateString) => {
    const appointmentTime = new Date(dateString).getTime();
    const now = new Date().getTime();
    const difference = appointmentTime - now;

    // If in the past
    if (difference < 0) {
      return 'Past';
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 pt-16 pb-12 md:pl-64">
      <StaffSidebar />

      <div className="p-4 sm:p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold mb-1">
            Welcome, {user?.firstName || 'Stylist'}!
          </h1>
          <p className="text-neutral-600">
            Here's an overview of your schedule and upcoming appointments.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-500 text-sm">Upcoming</p>
                <h3 className="text-3xl font-semibold mt-1">{stats.upcoming}</h3>
                <p className="text-neutral-500 text-sm mt-1">scheduled appointments</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <FaCalendarAlt size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-500 text-sm">Completed</p>
                <h3 className="text-3xl font-semibold mt-1">{stats.completed}</h3>
                <p className="text-neutral-500 text-sm mt-1">appointments to date</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <FaCalendarCheck size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-500 text-sm">Cancelled</p>
                <h3 className="text-3xl font-semibold mt-1">{stats.cancelled}</h3>
                <p className="text-neutral-500 text-sm mt-1">cancelled appointments</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full text-red-600">
                <FaCalendarTimes size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-500 text-sm">No-Shows</p>
                <h3 className="text-3xl font-semibold mt-1">{stats.noShow}</h3>
                <p className="text-neutral-500 text-sm mt-1">client no-shows</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                <FaClock size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="text-xl font-serif font-semibold">Today's Schedule</h2>
            <Link to="/staff/schedule" className="text-primary hover:text-primary-dark text-sm font-medium">
              View Full Schedule
            </Link>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <FaCalendarAlt className="mx-auto text-neutral-300 text-4xl mb-4" />
                <p className="mb-2">No appointments scheduled for today.</p>
                <p className="text-sm">Enjoy your free time!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mr-4 text-neutral-700">
                          <FaUser size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium">{appointment.client.firstName} {appointment.client.lastName}</h3>
                          <p className="text-neutral-500 text-sm">{appointment.client.phone}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-sm mr-3">{formatTime(appointment.date)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{appointment.service.name}</p>
                        <p className="text-neutral-500 text-sm">{appointment.service.duration} min</p>
                        {appointment.status === 'confirmed' && (
                          <div className="mt-2 text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {getTimeUntil(appointment.date)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="text-xl font-serif font-semibold">Upcoming Appointments</h2>
            <Link to="/staff/appointments" className="text-primary hover:text-primary-dark text-sm font-medium">
              View All
            </Link>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <FaClipboardList className="mx-auto text-neutral-300 text-4xl mb-4" />
                <p>No upcoming appointments scheduled.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead>
                    <tr className="text-left text-neutral-500 text-sm border-b border-neutral-200">
                      <th className="pb-3 font-medium">Date & Time</th>
                      <th className="pb-3 font-medium">Client</th>
                      <th className="pb-3 font-medium">Service</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-4 pr-4">
                          <div className="font-medium">{formatTime(appointment.date)}</div>
                          <div className="text-sm text-neutral-500">{formatDate(appointment.date)}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="font-medium">{appointment.client.firstName} {appointment.client.lastName}</div>
                          <div className="text-sm text-neutral-500">{appointment.client.phone}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div>{appointment.service.name}</div>
                          <div className="text-sm text-neutral-500">{appointment.service.duration} min</div>
                        </td>
                        <td className="py-4 pr-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Link
                            to={`/staff/appointments/${appointment._id}`}
                            className="text-primary hover:text-primary-dark font-medium text-sm"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
