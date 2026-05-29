const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const {
  updateProfile,
  getUserStats,
  getAllUsers,
  deactivateUser,
  activateUser
} = require('../controllers/userController');

router.put('/profile', protect, asyncHandler(updateProfile));
router.get('/stats', protect, asyncHandler(getUserStats));

router.get('/', protect, authorize('admin'), asyncHandler(getAllUsers));
router.patch('/:id/deactivate', protect, authorize('admin'), asyncHandler(deactivateUser));
router.patch('/:id/activate', protect, authorize('admin'), asyncHandler(activateUser));

module.exports = router;
