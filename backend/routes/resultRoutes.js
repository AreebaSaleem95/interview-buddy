const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const {
  getInterviewResult,
  getUserResults,
  createResult
} = require('../controllers/resultController');

router.get('/my-results', protect, asyncHandler(getUserResults));
router.get('/:interviewId', protect, asyncHandler(getInterviewResult));
router.post('/', protect, asyncHandler(createResult));

module.exports = router;
