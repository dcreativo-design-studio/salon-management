// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getMyAppointments,
  getStaffAppointments,
  completeAppointment,
  markNoShow,
  getAvailableSlots,
  getAppointmentStats,
  sendAppointmentReminders
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

// Public route for checking available slots
router.get('/available-slots', getAvailableSlots);

// Protected routes for all authenticated users
router.use(protect);

// Client appointments
router.get('/me', getMyAppointments);

// Create appointment
router.post('/', createAppointment);

// Get specific appointment
router.get('/:id', getAppointment);

// Cancel appointment
router.put('/:id/cancel', cancelAppointment);

// Staff & Admin routes
router.get('/staff/:staffId', authorize('staff', 'admin'), getStaffAppointments);
router.put('/:id/complete', authorize('staff', 'admin'), completeAppointment);
router.put('/:id/no-show', authorize('staff', 'admin'), markNoShow);

// Admin only routes
router.get('/', authorize('admin'), getAppointments);
router.put('/:id', authorize('admin'), updateAppointment);
router.get('/stats', authorize('admin'), getAppointmentStats);
router.post('/send-reminders', authorize('admin'), sendAppointmentReminders);

module.exports = router;
