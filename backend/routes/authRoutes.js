const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { buildAuthLimiter } = require('../middleware/rateLimiters');
const {
  register,
  login,
  logout,
  refreshToken,
  getProfile
} = require('../controllers/authController');

const authLimiter = buildAuthLimiter();

router.post('/register', authLimiter, asyncHandler(register));
router.post('/login', authLimiter, asyncHandler(login));
router.post('/refresh-token', authLimiter, asyncHandler(refreshToken));
router.post('/logout', protect, asyncHandler(logout));
router.get('/me', protect, asyncHandler(getProfile));

module.exports = router;
