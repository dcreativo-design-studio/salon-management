// src/services/staffService.js
import api from './api';

/**
 * Get all staff members
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with staff data
 */
export const getStaffMembers = async (params = {}) => {
  const response = await api.get('/api/staff', { params });
  return response.data;
};

/**
 * Get single staff member
 * @param {string} id - Staff ID
 * @returns {Promise} - Response with staff data
 */
// src/services/staffService.js (continued)
export const getStaffMember = async (id) => {
    const response = await api.get(`/api/staff/${id}`);
    return response.data;
  };

  /**
   * Get staff member by user ID
   * @param {string} userId - User ID
   * @returns {Promise} - Response with staff data
   */
  export const getStaffByUserId = async (userId) => {
    const response = await api.get(`/api/staff/user/${userId}`);
    return response.data;
  };

  /**
   * Update staff member (admin only)
   * @param {string} id - Staff ID
   * @param {Object} staffData - Updated staff data
   * @returns {Promise} - Response with updated staff
   */
  export const updateStaffMember = async (id, staffData) => {
    const response = await api.put(`/api/staff/${id}`, staffData);
    return response.data;
  };

  /**
   * Update own staff profile (staff only)
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Response with updated staff profile
   */
  export const updateOwnProfile = async (profileData) => {
    const response = await api.put('/api/staff/profile', profileData);
    return response.data;
  };

  /**
   * Get staff schedules
   * @param {string} id - Staff ID
   * @returns {Promise} - Response with staff schedules
   */
  export const getStaffSchedules = async (id) => {
    const response = await api.get(`/api/staff/${id}/schedules`);
    return response.data;
  };

  /**
   * Update staff schedule
   * @param {string} id - Staff ID
   * @param {number} dayOfWeek - Day of week (0-6, Sunday to Saturday)
   * @param {Object} scheduleData - Schedule data
   * @returns {Promise} - Response with updated schedule
   */
  export const updateSchedule = async (id, dayOfWeek, scheduleData) => {
    const response = await api.put(`/api/staff/${id}/schedules/${dayOfWeek}`, scheduleData);
    return response.data;
  };

  /**
   * Get staff vacations
   * @param {string} id - Staff ID
   * @param {Object} params - Query parameters
   * @returns {Promise} - Response with staff vacations
   */
  export const getStaffVacations = async (id, params = {}) => {
    const response = await api.get(`/api/staff/${id}/vacations`, { params });
    return response.data;
  };

  /**
   * Request vacation
   * @param {string} id - Staff ID
   * @param {Object} vacationData - Vacation data
   * @returns {Promise} - Response with created vacation request
   */
  export const requestVacation = async (id, vacationData) => {
    const response = await api.post(`/api/staff/${id}/vacations`, vacationData);
    return response.data;
  };

  /**
   * Update vacation status (admin only)
   * @param {string} id - Vacation ID
   * @param {Object} statusData - Status update data
   * @returns {Promise} - Response with updated vacation
   */
  export const updateVacationStatus = async (id, statusData) => {
    const response = await api.put(`/api/staff/vacations/${id}`, statusData);
    return response.data;
  };

  /**
   * Cancel vacation request
   * @param {string} id - Vacation ID
   * @returns {Promise} - Response with cancellation status
   */
  export const cancelVacation = async (id) => {
    const response = await api.delete(`/api/staff/vacations/${id}`);
    return response.data;
  };

  /**
   * Upload staff image
   * @param {string} id - Staff ID
   * @param {File} imageFile - Image file
   * @returns {Promise} - Response with updated staff
   */
  export const uploadStaffImage = async (id, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.put(`/api/staff/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  };

  /**
   * Get staff specialties
   * @returns {Promise} - Response with staff specialties
   */
  export const getStaffSpecialties = async () => {
    const response = await api.get('/api/staff/specialties');
    return response.data;
  };
