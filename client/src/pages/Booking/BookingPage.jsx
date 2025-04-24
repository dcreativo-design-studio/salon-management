// src/pages/Booking/BookingPage.jsx
import { format } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaArrowLeft, FaCalendarAlt, FaClock, FaCut, FaSpinner, FaUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { createAppointment, getAvailableSlots } from '../../services/appointmentService';
import { getServices } from '../../services/serviceService';
import { getStaffMembers } from '../../services/staffService';

const BookingPage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  // Services
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  // Staff
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Date & time
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  // Notes
  const [notes, setNotes] = useState('');

  // Booking
  const [isBooking, setIsBooking] = useState(false);

  // Check for pre-selected service or staff from query params
  useEffect(() => {
    const serviceId = queryParams.get('service');
    const staffId = queryParams.get('staff');

    if (serviceId) {
      setLoading(true);
      getServices()
        .then(response => {
          setServices(response.data);
          const service = response.data.find(s => s._id === serviceId);
          if (service) {
            setSelectedService(service);
            setCurrentStep(2); // Move to staff selection
          }
        })
        .catch(error => {
          console.error('Error fetching services:', error);
          toast.error('Failed to load services');
        })
        .finally(() => setLoading(false));
    } else {
      // Fetch services normally
      fetchServices();
    }

    if (staffId) {
      getStaffMembers()
        .then(response => {
          setStaff(response.data);
          const staffMember = response.data.find(s => s._id === staffId);
          if (staffMember) {
            setSelectedStaff(staffMember);
            if (serviceId) {
              setCurrentStep(3); // Move to date selection if both service and staff are selected
            }
          }
        })
        .catch(error => {
          console.error('Error fetching staff:', error);
          toast.error('Failed to load staff');
        });
    }
  }, []);

  // Fetch services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await getServices();
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff when a service is selected
  useEffect(() => {
    if (selectedService) {
      const fetchStaff = async () => {
        setLoading(true);
        try {
          // You might want to filter staff by those who can provide this service
          const response = await getStaffMembers({
            service: selectedService._id
          });
          setStaff(response.data);
        } catch (error) {
          console.error('Error fetching staff:', error);
          toast.error('Failed to load stylists');
        } finally {
          setLoading(false);
        }
      };

      fetchStaff();
    }
  }, [selectedService]);

  // Fetch available slots when date or staff/service changes
  useEffect(() => {
    if (selectedService && selectedStaff && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedService, selectedStaff, selectedDate]);

  // Function to fetch available time slots
  const fetchAvailableSlots = async () => {
    setFetchingSlots(true);
    setAvailableSlots([]);
    setSelectedSlot(null);

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await getAvailableSlots(
        selectedStaff._id,
        selectedService._id,
        formattedDate
      );

      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      toast.error('Failed to load available time slots');
    } finally {
      setFetchingSlots(false);
    }
  };

  // Handle service selection
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  // Handle staff selection
  const handleStaffSelect = (staffMember) => {
    setSelectedStaff(staffMember);
    setCurrentStep(3);
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Handle time slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setCurrentStep(4);
  };

  // Format time for display
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle booking submission
  const handleBooking = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login page with a return URL
      navigate(`/login?redirect=${encodeURIComponent('/booking')}`);
      return;
    }

    setIsBooking(true);

    try {
      const appointmentData = {
        serviceId: selectedService._id,
        staffId: selectedStaff._id,
        date: selectedSlot.start,
        notes: notes
      };

      const response = await createAppointment(appointmentData);

      // Navigate to confirmation page with appointment ID
      navigate(`/booking/confirmation/${response.data._id}`);
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-neutral-100 min-h-screen">
      <div className="container-custom">
        {/* Booking Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-primary p-8 text-white">
            <h1 className="text-3xl font-serif font-bold mb-2">Book Your Appointment</h1>
            <p className="text-white/80">
              Follow the steps below to schedule your perfect salon experience.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="p-6">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>
                1
              </div>
              <div className={`h-1 flex-1 ${
                currentStep >= 2 ? 'bg-primary' : 'bg-neutral-200'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>
                2
              </div>
              <div className={`h-1 flex-1 ${
                currentStep >= 3 ? 'bg-primary' : 'bg-neutral-200'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>
                3
              </div>
              <div className={`h-1 flex-1 ${
                currentStep >= 4 ? 'bg-primary' : 'bg-neutral-200'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 4 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>
                4
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-neutral-500">
              <span>Select Service</span>
              <span>Choose Stylist</span>
              <span>Pick Date & Time</span>
              <span>Confirm</span>
            </div>
          </div>
        </div>

        {/* Booking Content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-serif font-semibold mb-6">Choose a Service</h2>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className={`border rounded-lg p-6 cursor-pointer transition-all ${
                        selectedService?._id === service._id
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-neutral-200 hover:border-primary hover:shadow-md'
                      }`}
                      onClick={() => handleServiceSelect(service)}
                    >
                      <div className="flex items-start mb-4">
                        <div className="mr-4 text-primary">
                          <FaCut size={24} />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg mb-1">{service.name}</h3>
                          <p className="text-neutral-500 text-sm mb-2">{service.description}</p>
                          <div className="flex justify-between">
                            <span className="text-primary font-medium">${service.price.toFixed(2)}</span>
                            <span className="text-neutral-500 text-sm">{service.duration} min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Staff Selection */}
          {currentStep === 2 && (
            <div className="p-8">
              <button
                className="flex items-center text-neutral-500 hover:text-primary mb-6"
                onClick={goToPreviousStep}
              >
                <FaArrowLeft className="mr-2" />
                Back to Services
              </button>

              <h2 className="text-2xl font-serif font-semibold mb-6">Choose a Stylist</h2>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : staff.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-neutral-500 mb-4">No stylists available for this service.</p>
                  <button
                    className="btn-secondary"
                    onClick={goToPreviousStep}
                  >
                    Choose a Different Service
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {staff.map((staffMember) => (
                    <div
                      key={staffMember._id}
                      className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                        selectedStaff?._id === staffMember._id
                          ? 'border-primary shadow-md'
                          : 'border-neutral-200 hover:border-primary hover:shadow-md'
                      }`}
                      onClick={() => handleStaffSelect(staffMember)}
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={staffMember.image || `/src/assets/images/stylist-${Math.floor(Math.random() * 4) + 1}.jpg`}
                          alt={staffMember.userId?.firstName}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-lg mb-1">{staffMember.userId?.firstName} {staffMember.userId?.lastName}</h3>
                        <p className="text-primary text-sm mb-2">{staffMember.title}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {staffMember.specialties && staffMember.specialties.slice(0, 3).map((specialty, idx) => (
                            <span key={idx} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                              {specialty}
                            </span>
                          ))}
                        </div>
                        <p className="text-neutral-500 text-sm line-clamp-2">
                          {staffMember.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Date & Time Selection */}
          {currentStep === 3 && (
            <div className="p-8">
              <button
                className="flex items-center text-neutral-500 hover:text-primary mb-6"
                onClick={goToPreviousStep}
              >
                <FaArrowLeft className="mr-2" />
                Back to Stylists
              </button>

              <h2 className="text-2xl font-serif font-semibold mb-6">Choose Date & Time</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Date Picker */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Select a Date</h3>
                  <div className="bg-white border border-neutral-200 rounded-lg p-4">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateSelect}
                      minDate={new Date()}
                      inline
                      calendarClassName="w-full"
                    />
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Available Time Slots</h3>
                  <div className="bg-white border border-neutral-200 rounded-lg p-4 h-full">
                    {fetchingSlots ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="flex flex-col justify-center items-center h-64 text-center">
                        <FaClock className="text-neutral-300 text-4xl mb-4" />
                        <p className="text-neutral-500 mb-2">No available time slots for this date.</p>
                        <p className="text-neutral-500 text-sm">Please try selecting another date or stylist.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            className={`p-3 rounded-md text-center ${
                              selectedSlot?.start === slot.start
                                ? 'bg-primary text-white'
                                : 'bg-neutral-100 hover:bg-primary/10 text-neutral-700'
                            }`}
                            onClick={() => handleSlotSelect(slot)}
                          >
                            {formatTime(slot.start)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="p-8">
              <button
                className="flex items-center text-neutral-500 hover:text-primary mb-6"
                onClick={goToPreviousStep}
              >
                <FaArrowLeft className="mr-2" />
                Back to Date & Time
              </button>

              <h2 className="text-2xl font-serif font-semibold mb-6">Confirm Your Appointment</h2>

              <div className="bg-neutral-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-4 text-center">Appointment Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="mr-3 text-primary mt-1">
                        <FaCut />
                      </div>
                      <div>
                        <h4 className="font-medium">Service</h4>
                        <p>{selectedService.name}</p>
                        <div className="flex justify-between text-sm text-neutral-500 mt-1">
                          <span>${selectedService.price.toFixed(2)}</span>
                          <span>{selectedService.duration} min</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="mr-3 text-primary mt-1">
                        <FaUser />
                      </div>
                      <div>
                        <h4 className="font-medium">Stylist</h4>
                        <p>{selectedStaff.userId?.firstName} {selectedStaff.userId?.lastName}</p>
                        <p className="text-sm text-neutral-500">{selectedStaff.title}</p>
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
                        <p>{formatDate(selectedDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="mr-3 text-primary mt-1">
                        <FaClock />
                      </div>
                      <div>
                        <h4 className="font-medium">Time</h4>
                        <p>{formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="notes" className="block font-medium mb-2">Additional Notes (Optional)</label>
                <textarea
                  id="notes"
                  className="form-input w-full"
                  rows="3"
                  placeholder="Any specific requests or information for your stylist?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              {!isAuthenticated && (
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <p className="text-blue-600 text-sm">
                    You'll need to sign in before completing your booking. Don't worry, you'll be redirected back here after logging in.
                  </p>
                </div>
              )}

              <button
                className="btn-primary w-full flex items-center justify-center"
                onClick={handleBooking}
                disabled={isBooking}
              >
                {isBooking ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Booking...
                  </>
                ) : (
                  <>
                    <FaCalendarAlt className="mr-2" />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
