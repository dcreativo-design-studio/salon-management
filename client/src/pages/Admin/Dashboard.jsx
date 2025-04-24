// src/pages/Admin/Dashboard.jsx
import { useContext, useEffect, useState } from 'react';
import { FaCalendarAlt, FaChartBar, FaRegClock, FaUsers, FaUserTie } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/Layout/AdminSidebar';
import AuthContext from '../../context/AuthContext';
import { getAppointments, getAppointmentStats } from '../../services/appointmentService';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    noShowAppointments: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [appointmentsRes, statsRes] = await Promise.all([
          getAppointments({
            startDate: today.toISOString(),
            endDate: tomorrow.toISOString(),
            limit: 5
          }),
          getAppointmentStats()
        ]);

        setAppointments(appointmentsRes.data);
        setStatsData(statsRes.data);

        // Calculate totals
        const statusCounts = statsRes.data.statusCounts || {};
        setStats({
          totalAppointments: Object.values(statusCounts).reduce((a, b) => a + b, 0),
          pendingAppointments: statusCounts.pending || 0,
          confirmedAppointments: statusCounts.confirmed || 0,
          completedAppointments: statusCounts.completed || 0,
          cancelledAppointments: statusCounts.cancelled || 0,
          noShowAppointments: statusCounts['no-show'] || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
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

  return (
    <div className="min-h-screen bg-neutral-100 pt-16 pb-12 md:pl-64">
      <AdminSidebar />

      <div className="p-4 sm:p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold mb-1">Welcome, {user?.firstName || 'Admin'}!</h1>
          <p className="text-neutral-600">Here's what's happening at your salon today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-500 text-sm">Total Appointments</p>
                <h3 className="text-3xl font-semibold mt-1 mb-2">{stats.totalAppointments}</h3>
                <div className="flex space-x-4 text-sm">
                  <span className="text-green-600">{stats.confirmedAppointments} Confirmed</span>
                  <span className="text-blue-600">{stats.completedAppointments} Completed</span>
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <FaCalendarAlt size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-500 text-sm">Cancelled / No-Shows</p>
                <h3 className="text-3xl font-semibold mt-1 mb-2">{stats.cancelledAppointments + stats.noShowAppointments}</h3>
                <div className="flex space-x-4 text-sm">
                  <span className="text-red-600">{stats.cancelledAppointments} Cancelled</span>
                  <span className="text-orange-600">{stats.noShowAppointments} No-Show</span>
                </div>
              </div>
              <div className="bg-red-100 p-3 rounded-full text-red-500">
                <FaRegClock size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-500 text-sm">Quick Access</p>
                <div className="mt-4 space-y-2">
                  <Link
                    to="/admin/appointments"
                    className="block text-primary hover:text-primary-dark font-medium"
                  >
                    View All Appointments
                  </Link>
                  <Link
                    to="/admin/clients"
                    className="block text-primary hover:text-primary-dark font-medium"
                  >
                    Manage Clients
                  </Link>
                  <Link
                    to="/admin/services"
                    className="block text-primary hover:text-primary-dark font-medium"
                  >
                    Manage Services
                  </Link>
                </div>
              </div>
              <div className="bg-secondary/10 p-3 rounded-full text-secondary">
                <FaChartBar size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/appointments" className="bg-gradient-to-r from-primary/80 to-primary p-6 rounded-lg shadow-md text-white hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 p-3 rounded-full mr-4">
                <FaCalendarAlt size={20} />
              </div>
              <h3 className="text-xl font-semibold">Appointments</h3>
            </div>
            <p className="text-white/80 mb-2">Manage booking calendar and client appointments</p>
            <p className="font-semibold text-2xl">{stats.totalAppointments}</p>
          </Link>

          <Link to="/admin/services" className="bg-gradient-to-r from-secondary/80 to-secondary p-6 rounded-lg shadow-md text-white hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 p-3 rounded-full mr-4">
                <FaScissors size={20} />
              </div>
              <h3 className="text-xl font-semibold">Services</h3>
            </div>
            <p className="text-white/80 mb-2">Manage salon services and pricing</p>
            <p className="font-semibold text-2xl">{statsData?.serviceStats?.length || 0}</p>
          </Link>

          <Link to="/admin/staff" className="bg-gradient-to-r from-accent/80 to-accent p-6 rounded-lg shadow-md text-white hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 p-3 rounded-full mr-4">
                <FaUserTie size={20} />
              </div>
              <h3 className="text-xl font-semibold">Staff</h3>
            </div>
            <p className="text-white/80 mb-2">Manage stylists and their schedules</p>
            <p className="font-semibold text-2xl">{statsData?.staffStats?.length || 0}</p>
          </Link>

          <Link to="/admin/clients" className="bg-gradient-to-r from-neutral-600 to-neutral-700 p-6 rounded-lg shadow-md text-white hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 p-3 rounded-full mr-4">
                <FaUsers size={20} />
              </div>
              <h3 className="text-xl font-semibold">Clients</h3>
            </div>
            <p className="text-white/80 mb-2">Manage client database and histories</p>
            <p className="font-semibold text-2xl">-</p>
          </Link>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="text-xl font-serif font-semibold">Today's Appointments</h2>
            <Link to="/admin/appointments" className="text-primary hover:text-primary-dark text-sm font-medium">
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
                No appointments scheduled for today.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead>
                    <tr className="text-left text-neutral-500 text-sm border-b border-neutral-200">
                      <th className="pb-3 font-medium">Time</th>
                      <th className="pb-3 font-medium">Client</th>
                      <th className="pb-3 font-medium">Service</th>
                      <th className="pb-3 font-medium">Stylist</th>
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
                          {appointment.staff.userId ? (
                            <div>{appointment.staff.userId.firstName} {appointment.staff.userId.lastName}</div>
                          ) : (
                            <div>Staff #{appointment.staff._id.substring(0, 6)}</div>
                          )}
                        </td>
                        <td className="py-4 pr-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Link
                            to={`/admin/appointments/${appointment._id}`}
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

        {/* Popular Services */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-xl font-serif font-semibold">Popular Services</h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : !statsData?.serviceStats || statsData.serviceStats.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                No service statistics available yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsData.serviceStats.slice(0, 6).map((service, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4">
                    <h3 className="font-medium mb-2">{service.serviceName}</h3>
                    <div className="flex justify-between text-sm">
                      <span>Bookings</span>
                      <span className="font-semibold">{service.count}</span>
                    </div>
                    <div className="mt-3 bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full"
                        style={{
                          width: `${Math.min(100, (service.count / Math.max(...statsData.serviceStats.map(s => s.count))) * 100)}%`
                        }}
                      ></div>
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

export default AdminDashboard;
