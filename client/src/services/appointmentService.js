// src/services/appointmentService.js
import api from './api';

/**
 * Get all appointments (admin only)
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with appointments data
 */
export const getAppointments = async (params = {}) => {
  const response = await api.get('/api/appointments', { params });
  return response.data;
};

/**
 * Get single appointment
 * @param {string} id - Appointment ID
 * @returns {Promise} - Response with appointment data
 */
export const getAppointment = async (id) => {
  const response = await api.get(`/api/appointments/${id}`);
  return response.data;
};

/**
 * Create new appointment
 * @param {Object} appointmentData - Appointment data
 * @param {string} appointmentData.serviceId - Service ID
 * @param {string} appointmentData.staffId - Staff ID
 * @param {Date} appointmentData.date - Appointment date and time
 * @param {string} appointmentData.notes - Optional notes
 * @returns {Promise} - Response with created appointment
 */
export const createAppointment = async (appointmentData) => {
  const response = await api.post('/api/appointments', appointmentData);
  return response.data;
};

/**
 * Update appointment (admin only)
 * @param {string} id - Appointment ID
 * @param {Object} appointmentData - Updated appointment data
 * @returns {Promise} - Response with updated appointment
 */
export const updateAppointment = async (id, appointmentData) => {
  const response = await api.put(`/api/appointments/${id}`, appointmentData);
  return response.data;
};

/**
 * Cancel appointment
 * @param {string} id - Appointment ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise} - Response with cancelled appointment
 */
export const cancelAppointment = async (id, reason) => {
  const response = await api.put(`/api/appointments/${id}/cancel`, { reason });
  return response.data;
};

/**
 * Get logged in user's appointments
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with user's appointments
 */
export const getMyAppointments = async (params = {}) => {
  const response = await api.get('/api/appointments/me', { params });
  return response.data;
};

/**
 * Get appointments for a staff member
 * @param {string} staffId - Staff ID
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with staff appointments
 */
export const getStaffAppointments = async (staffId, params = {}) => {
  const response = await api.get(`/api/appointments/staff/${staffId}`, { params });
  return response.data;
};

/**
 * Mark appointment as completed (staff/admin only)
 * @param {string} id - Appointment ID
 * @returns {Promise} - Response with completed appointment
 */
export const completeAppointment = async (id) => {
  const response = await api.put(`/api/appointments/${id}/complete`);
  return response.data;
};

/**
 * Mark appointment as no-show (staff/admin only)
 * @param {string} id - Appointment ID
 * @returns {Promise} - Response with updated appointment
 */
export const markNoShow = async (id) => {
  const response = await api.put(`/api/appointments/${id}/no-show`);
  return response.data;
};

/**
 * Get available time slots for a service and staff member
 * @param {string} staffId - Staff ID
 * @param {string} serviceId - Service ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise} - Response with available time slots
 */
export const getAvailableSlots = async (staffId, serviceId, date) => {
  const response = await api.get('/api/appointments/available-slots', {
    params: { staffId, serviceId, date }
  });
  return response.data;
};

/**
 * Get appointment statistics (admin only)
 * @param {Object} params - Query parameters for date range
 * @returns {Promise} - Response with appointment statistics
 */
export const getAppointmentStats = async (params = {}) => {
  const response = await api.get('/api/appointments/stats', { params });
  return response.data;
};

/**
 * Send appointment reminders (admin only)
 * @returns {Promise} - Response with reminder sending results
 */
export const sendAppointmentReminders = async () => {
  const response = await api.post('/api/appointments/send-reminders');
  return response.data;
};
