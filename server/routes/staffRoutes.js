// routes/staffRoutes.js
const express = require('express');
const router = express.Router();
const {
  getStaffMembers,
  getStaffMember,
  getStaffByUserId,
  updateStaffMember,
  updateOwnProfile,
  getStaffSchedules,
  updateSchedule,
  getStaffVacations,
  requestVacation,
  updateVacationStatus,
  cancelVacation,
  uploadStaffImage,
  getStaffSpecialties
} = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Setup file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/staff');
  },
  // routes/staffRoutes.js (continued)
  filename: (req, file, cb) => {
    cb(null, `staff-${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5000000 } // 5MB limit
});

// Public routes
router.get('/', getStaffMembers);
router.get('/specialties', getStaffSpecialties);
router.get('/:id', getStaffMember);

// Protected routes
router.use(protect);

// Staff member routes
router.get('/user/:userId', getStaffByUserId);
router.put('/profile', authorize('staff'), updateOwnProfile);

// Staff schedules
router.get('/:id/schedules', getStaffSchedules);
router.put('/:id/schedules/:dayOfWeek', authorize('staff', 'admin'), updateSchedule);

// Staff vacations
router.get('/:id/vacations', getStaffVacations);
router.post('/:id/vacations', authorize('staff', 'admin'), requestVacation);
router.put('/vacations/:id', authorize('admin'), updateVacationStatus);
router.delete('/vacations/:id', cancelVacation);

// File upload
router.put('/:id/image', upload.single('image'), uploadStaffImage);

// Admin only routes
router.put('/:id', authorize('admin'), updateStaffMember);

module.exports = router;
