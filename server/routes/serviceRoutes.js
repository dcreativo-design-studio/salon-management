// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getServiceCategories,
  uploadServiceImage
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Setup file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/services');
  },
  filename: (req, file, cb) => {
    cb(null, `service-${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
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
router.get('/', getServices);
router.get('/categories', getServiceCategories);
router.get('/:id', getService);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);
router.put('/:id/image', upload.single('image'), uploadServiceImage);

module.exports = router;
