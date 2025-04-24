// src/services/serviceService.js
import api from './api';

/**
 * Get all services
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with services data
 */
export const getServices = async (params = {}) => {
  const response = await api.get('/api/services', { params });
  return response.data;
};

/**
 * Get single service
 * @param {string} id - Service ID
 * @returns {Promise} - Response with service data
 */
export const getService = async (id) => {
  const response = await api.get(`/api/services/${id}`);
  return response.data;
};

/**
 * Create new service (admin only)
 * @param {Object} serviceData - Service data
 * @returns {Promise} - Response with created service
 */
export const createService = async (serviceData) => {
  const response = await api.post('/api/services', serviceData);
  return response.data;
};

/**
 * Update service (admin only)
 * @param {string} id - Service ID
 * @param {Object} serviceData - Updated service data
 * @returns {Promise} - Response with updated service
 */
export const updateService = async (id, serviceData) => {
  const response = await api.put(`/api/services/${id}`, serviceData);
  return response.data;
};

/**
 * Delete service (admin only)
 * @param {string} id - Service ID
 * @returns {Promise} - Response with deletion status
 */
export const deleteService = async (id) => {
  const response = await api.delete(`/api/services/${id}`);
  return response.data;
};

/**
 * Get all service categories
 * @returns {Promise} - Response with service categories
 */
export const getServiceCategories = async () => {
  const response = await api.get('/api/services/categories');
  return response.data;
};

/**
 * Upload service image (admin only)
 * @param {string} id - Service ID
 * @param {File} imageFile - Image file
 * @returns {Promise} - Response with updated service
 */
export const uploadServiceImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await api.put(`/api/services/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};
