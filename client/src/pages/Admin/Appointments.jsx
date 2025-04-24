// src/pages/Admin/Appointments.jsx
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaCheck, FaExclamationCircle, FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/Layout/AdminSidebar';
import { getAppointments } from '../../services/appointmentService';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  useEffect(() => {
    fetchAppointments();
  }, [pagination.page, status, startDate, endDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (status) {
        params.status = status;
      }

      if (startDate && endDate) {
        params.startDate = startDate.toISOString();
        params.endDate = endDate.toISOString();
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await getAppointments(params);
      setAppointments(response.data);
      setPagination({
        ...pagination,
        totalPages: response.pagination.pages,
        totalItems: response.pagination.total
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAppointments();
  };

  const resetFilters = () => {
    setDateRange([null, null]);
    setStatus('');
    setSearchQuery('');
    setPagination({
      ...pagination,
      page: 1
    });
  };

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
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

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FaCalendarAlt className="mr-2" />;
      case 'completed':
        return <FaCheck className="mr-2" />;
      case 'cancelled':
        return <FaTimes className="mr-2" />;
      case 'no-show':
        return <FaExclamationCircle className="mr-2" />;
      default:
        return <FaCalendarAlt className="mr-2" />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 pt-16 pb-12 md:pl-64">
      <AdminSidebar />

      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold mb-1">Appointments</h1>
            <p className="text-neutral-600">
              View and manage all salon appointments.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/booking" className="btn-primary">
              <FaCalendarAlt className="mr-2" />
              Create Appointment
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-medium">Appointments List</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-primary hover:text-primary-dark font-medium"
            >
              <FaFilter className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showFilters && (
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="form-label">Date Range</label>
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => setDateRange(update)}
                      className="form-input w-full"
                      placeholderText="Select date range"
                      isClearable
                    />
                  </div>

                  <div>
                    <label className="form-label">Status</label>
                    <select
                      className="form-input"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Search</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-neutral-400" />
                      </div>
                      <input
                        type="text"
                        className="form-input pl-10"
                        placeholder="Search by client name, service..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Appointments Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-6 text-center">
                <FaCalendarAlt className="mx-auto text-neutral-300 text-4xl mb-4" />
                <h3 className="text-lg font-medium mb-2">No Appointments Found</h3>
                <p className="text-neutral-500 mb-4">
                  No appointments match your current filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <table className="w-full min-w-full table-auto">
                <thead>
                  <tr className="bg-neutral-50 text-left text-neutral-500 text-sm">
                    <th className="px-6 py-3 font-medium">Date & Time</th>
                    <th className="px-6 py-3 font-medium">Client</th>
                    <th className="px-6 py-3 font-medium">Service</th>
                    <th className="px-6 py-3 font-medium">Stylist</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <div className="font-medium">{formatTime(appointment.date)}</div>
                        <div className="text-sm text-neutral-500">{formatDate(appointment.date)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{appointment.client.firstName} {appointment.client.lastName}</div>
                        <div className="text-sm text-neutral-500">{appointment.client.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{appointment.service.name}</div>
                        <div className="text-sm text-neutral-500">{appointment.service.duration} min - ${appointment.service.price}</div>
                      </td>
                      <td className="px-6 py-4">
                        {appointment.staff.userId ? (
                          <div>{appointment.staff.userId.firstName} {appointment.staff.userId.lastName}</div>
                        ) : (
                          <div>Staff #{appointment.staff._id.substring(0, 6)}</div>
                        )}
                        <div className="text-sm text-neutral-500">{appointment.staff.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/appointments/${appointment._id}`}
                          className="text-primary hover:text-primary-dark font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && appointments.length > 0 && (
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
              <div className="text-sm text-neutral-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalItems)} of {pagination.totalItems} appointments
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 rounded-md ${
                    pagination.page === 1
                      ? 'text-neutral-400 cursor-not-allowed'
                      : 'text-primary hover:bg-neutral-200'
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(p => {
                    // Show first, last, and pages around current page
                    return p === 1 || p === pagination.totalPages ||
                      (p >= pagination.page - 1 && p <= pagination.page + 1);
                  })
                  .map((page, i, arr) => (
                    <React.Fragment key={page}>
                      {i > 0 && arr[i - 1] !== page - 1 && (
                        <span className="px-3 py-1">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md ${
                          pagination.page === page
                            ? 'bg-primary text-white'
                            : 'text-primary hover:bg-neutral-200'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-3 py-1 rounded-md ${
                    pagination.page === pagination.totalPages
                      ? 'text-neutral-400 cursor-not-allowed'
                      : 'text-primary hover:bg-neutral-200'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
