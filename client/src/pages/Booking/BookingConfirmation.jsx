// src/pages/Booking/BookingConfirmation.jsx
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCalendarPlus, FaCheckCircle, FaClock, FaCut, FaHistory, FaHome, FaUser } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAppointment } from '../../services/appointmentService';

const BookingConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      setLoading(true);
      try {
        const response = await getAppointment(id);
        setAppointment(response.data);
      } catch (error) {
        console.error('Error fetching appointment:', error);
        setError('Failed to load appointment details. Please check your booking history.');
        toast.error('Error loading appointment details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAppointment();
    } else {
      navigate('/booking');
    }
  }, [id, navigate]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  // Add to calendar functions (these would be expanded in a real implementation)
  const addToGoogleCalendar = () => {
    // Implementation would create a Google Calendar link with appointment details
    toast.info('Google Calendar integration would be implemented here');
  };

  const addToOutlookCalendar = () => {
    // Implementation would create an Outlook Calendar link with appointment details
    toast.info('Outlook Calendar integration would be implemented here');
  };

  const addToAppleCalendar = () => {
    // Implementation would create an Apple Calendar link with appointment details
    toast.info('Apple Calendar integration would be implemented here');
  };

  return (
    <div className="pt-24 pb-16 bg-neutral-100 min-h-screen">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-serif font-bold mb-3">Error Loading Appointment</h2>
                <p className="mb-6">{error}</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/booking" className="btn-primary">
                  Try Booking Again
                </Link>
                <Link to="/client/appointments" className="btn-outline">
                  View Your Appointments
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-primary p-8 text-white text-center">
                <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary mb-4">
                  <FaCheckCircle size={32} />
                </div>
                <h1 className="text-3xl font-serif font-bold mb-2">Booking Confirmed!</h1>
                <p className="text-white/90">
                  Your appointment has been successfully scheduled. We look forward to seeing you!
                </p>
              </div>

              <div className="p-8">
                <div className="bg-neutral-50 p-6 rounded-lg mb-8">
                  <h2 className="text-xl font-serif font-semibold mb-4 text-center">Appointment Details</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="mr-3 text-primary mt-1">
                          <FaCut />
                        </div>
                        <div>
                          <h4 className="font-medium">Service</h4>
                          <p>{appointment.service.name}</p>
                          <div className="flex justify-between text-sm text-neutral-500 mt-1">
                            <span>${appointment.service.price.toFixed(2)}</span>
                            <span>{appointment.service.duration} min</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="mr-3 text-primary mt-1">
                          <FaUser />
                        </div>
                        <div>
                          <h4 className="font-medium">Stylist</h4>
                          <p>{appointment.staff.userId?.firstName} {appointment.staff.userId?.lastName}</p>
                          <p className="text-sm text-neutral-500">{appointment.staff.title}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="mr-3 text-primary mt-1">
                          <FaCalendarAlt />
                        </div>
                        <div>
                          <h4 className="font-medium">Date</h4>
                          <p>{formatDate(appointment.date)}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="mr-3 text-primary mt-1">
                          <FaClock />
                        </div>
                        <div>
                          <h4 className="font-medium">Time</h4>
                          // src/pages/Booking/BookingConfirmation.jsx (continued)
                          <p>{formatTime(appointment.date)} - {formatTime(appointment.endTime)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-6 pt-4 border-t border-neutral-200">
                      <h4 className="font-medium mb-2">Additional Notes</h4>
                      <p className="text-neutral-600">{appointment.notes}</p>
                    </div>
                  )}
                </div>

                {/* Reminder Section */}
                <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <h3 className="text-lg font-medium mb-4 text-blue-800">Important Reminders</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>Please arrive 10 minutes before your scheduled time.</li>
                    <li>If you need to cancel or reschedule, please do so at least 24 hours in advance.</li>
                    <li>For hair coloring services, please consider wearing dark clothing.</li>
                    <li>Complimentary parking is available behind our salon.</li>
                  </ul>
                </div>

                {/* Add to Calendar Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Add to Your Calendar</h3>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={addToGoogleCalendar}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-md flex items-center text-neutral-700 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm4.9 6V9h-3v3h-3V9h-3V6h3V3h3v3h3zm-1.9 15c-4.7 0-8.6-3.4-9.3-7.9l3.3-1.3v.9c0 .6.4 1 1 1h1.9v-1.5c0-.8.7-1.5 1.5-1.5h4.5c.8 0 1.5.7 1.5 1.5v1.5h1.9c.6 0 1-.4 1-1v-.9l3.3 1.3c-.7 4.5-4.6 7.9-9.3 7.9z"/>
                      </svg>
                      Google Calendar
                    </button>
                    <button
                      onClick={addToOutlookCalendar}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-md flex items-center text-neutral-700 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M7.88 12.04c-.5 0-1 .4-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1M24 5v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h20a2 2 0 0 1 2 2M8 6a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H8z"/>
                      </svg>
                      Outlook Calendar
                    </button>
                    <button
                      onClick={addToAppleCalendar}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-md flex items-center text-neutral-700 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M14.023 12.154c.012-1.197.994-1.764 1.042-1.794-.578-.84-1.469-954-2.057-.953-.869.015-1.744.522-2.199.522-.462 0-1.155-.507-1.902-.493-.964.015-1.852.57-2.369 1.433-1.022 1.768-.256 4.376.726 5.803.49.699 1.062 1.486 1.809 1.461.732-.03 1.002-.467 1.886-.467.876 0 1.133.467 1.898.446.783-.012 1.277-.702 1.747-1.408.558-.799.783-1.582.788-1.622-.018-.012-1.507-.579-1.517-2.293M12.864 8.47c.394-.493.663-1.164.59-1.839-.575.03-1.291.399-1.7.881-.367.429-.693 1.126-.608 1.786.647.046 1.31-.331 1.718-.828"/>
                      </svg>
                      Apple Calendar
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/" className="btn-outline flex-1 flex items-center justify-center">
                    <FaHome className="mr-2" />
                    Back to Home
                  </Link>
                  <Link to="/client/appointments" className="btn-secondary flex-1 flex items-center justify-center">
                    <FaHistory className="mr-2" />
                    View My Appointments
                  </Link>
                  <Link to="/booking" className="btn-primary flex-1 flex items-center justify-center">
                    <FaCalendarPlus className="mr-2" />
                    Book Another
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
