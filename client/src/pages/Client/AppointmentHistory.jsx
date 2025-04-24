// src/pages/Client/AppointmentHistory.jsx
import { useEffect, useState } from 'react';
import {
    FaCalendarAlt,
    FaCheckCircle,
    FaChevronLeft,
    FaChevronRight,
    FaClock,
    FaExclamationCircle,
    FaFilter,
    FaTimesCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getMyAppointments } from '../../services/appointmentService';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'
  const [status, setStatus] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [filter, status, pagination.page]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let params = {
        page: pagination.page,
        limit: 8
      };

      if (filter === 'upcoming') {
        params.upcoming = true;
      } else if (filter === 'past') {
        params.past = true;
      }

      if (status) {
        params.status = status;
      }

      const response = await getMyAppointments(params);
      setAppointments(response.data);
      setPagination({
        page: response.pagination.currentPage,
        totalPages: response.pagination.pages,
        totalItems: response.pagination.total
      });
    } catch (err) {
      setError('Failed to load appointments. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        return 'bg-primary/10 text-primary';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <FaCheckCircle className="mr-1" />;
      case 'cancelled':
        return <FaTimesCircle className="mr-1" />;
      case 'no-show':
        return <FaExclamationCircle className="mr-1" />;
      default:
        return <FaCalendarAlt className="mr-1" />;
    }
  };

  // Change page
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({
        ...pagination,
        page: newPage
      });
    }
  };

  // Apply filters
  const applyFilters = (e) => {
    e.preventDefault();
    // The useEffect will trigger a new fetch with the updated filters
  };

  // Reset filters
  const resetFilters = () => {
    setFilter('all');
    setStatus('');
    setPagination({
      ...pagination,
      page: 1
    });
  };

  // Toggle filters section
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="pt-24 pb-16 bg-neutral-100 min-h-screen">
      <div className="container-custom">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-secondary p-8 text-white">
            <h1 className="text-3xl font-serif font-bold mb-2">Appointment History</h1>
            <p className="text-white/80">
              View and manage your past, current, and upcoming appointments.
            </p>
          </div>

          <div className="p-8">
            {/* Filter and Search */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                  <button
                    className={`py-2 px-4 rounded-md transition-colors ${filter === 'all' ? 'bg-secondary text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                    onClick={() => setFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`py-2 px-4 rounded-md transition-colors ${filter === 'upcoming' ? 'bg-secondary text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                    onClick={() => setFilter('upcoming')}
                  >
                    Upcoming
                  </button>
                  <button
                    className={`py-2 px-4 rounded-md transition-colors ${filter === 'past' ? 'bg-secondary text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                    onClick={() => setFilter('past')}
                  >
                    Past
                  </button>
                </div>

                <button
                  className="flex items-center text-neutral-700 hover:text-secondary transition-colors"
                  onClick={toggleFilters}
                >
                  <FaFilter className="mr-2" />
                  Filters
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="bg-neutral-50 p-4 rounded-md">
                  <form onSubmit={applyFilters}>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[200px]">
                        <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
                          Status
                        </label>
                        <select
                          id="status"
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

                      <div className="flex items-end space-x-3">
                        <button
                          type="submit"
                          className="btn-secondary py-2 px-4 text-sm"
                        >
                          Apply Filters
                        </button>
                        <button
                          type="button"
                          className="py-2 px-4 text-sm text-neutral-700 bg-neutral-200 hover:bg-neutral-300 rounded-md transition-colors"
                          onClick={resetFilters}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Appointments List */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                {error}
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <FaCalendarAlt className="text-neutral-400 text-2xl" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Appointments Found</h3>
                <p className="text-neutral-600 mb-6">
                  {filter === 'upcoming'
                    ? "You don't have any upcoming appointments."
                    : filter === 'past'
                      ? "You don't have any past appointments."
                      : "You don't have any appointments yet."}
                </p>
                <Link to="/booking" className="btn-primary">
                  Book an Appointment
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {appointments.map((appointment) => (
                  <div key={appointment._id} className="border border-neutral-200 rounded-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-xl font-medium mb-2">{appointment.service.name}</h3>
                        <p className="text-neutral-600 mb-4">
                        // src/pages/Client/AppointmentHistory.jsx (continued)
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
                      <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </span>
                        <span className="text-sm text-neutral-500">
                          Duration: {appointment.service.duration} min
                        </span>
                        <span className="text-sm text-neutral-500">
                          Price: ${appointment.service.price.toFixed(2)}
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

                      {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                        <Link
                          to={`/client/appointments/${appointment._id}/cancel`}
                          className="py-2 px-4 text-sm border border-red-300 text-red-500 hover:bg-red-50 rounded-md transition-colors flex-1 text-center"
                        >
                          Cancel
                        </Link>
                      )}

                      {appointment.status === 'completed' && (
                        <Link
                          to={`/booking?rebook=${appointment.service._id}&staff=${appointment.staff._id}`}
                          className="py-2 px-4 text-sm border border-green-300 text-green-500 hover:bg-green-50 rounded-md transition-colors flex-1 text-center"
                        >
                          Book Again
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && appointments.length > 0 && (
              <div className="flex justify-between items-center mt-8">
                <p className="text-sm text-neutral-500">
                  Showing {appointments.length} of {pagination.totalItems} appointments
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`p-2 rounded-md ${pagination.page === 1 ? 'text-neutral-300 cursor-not-allowed' : 'text-neutral-700 hover:bg-neutral-100'}`}
                  >
                    <FaChevronLeft />
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      const current = pagination.page;
                      return page === 1 || page === pagination.totalPages ||
                        (page >= current - 1 && page <= current + 1);
                    })
                    .map((page, index, array) => {
                      // Add ellipsis
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <span
                            key={`ellipsis-${page}`}
                            className="flex items-center justify-center w-10 h-10 text-neutral-500"
                          >
                            ...
                          </span>
                        );
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-md ${pagination.page === page
                            ? 'bg-secondary text-white'
                            : 'text-neutral-700 hover:bg-neutral-100'}`}
                        >
                          {page}
                        </button>
                      );
                    })}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`p-2 rounded-md ${pagination.page === pagination.totalPages ? 'text-neutral-300 cursor-not-allowed' : 'text-neutral-700 hover:bg-neutral-100'}`}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentHistory;
