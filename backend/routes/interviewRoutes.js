const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const {
  startInterview,
  getInterviewById,
  getUserInterviews,
  submitAnswer,
  completeInterview
} = require('../controllers/interviewController');

router.post('/start', protect, asyncHandler(startInterview));
router.get('/my-interviews', protect, asyncHandler(getUserInterviews));
router.get('/:id', protect, asyncHandler(getInterviewById));
router.post('/:interviewId/submit-answer', protect, asyncHandler(submitAnswer));
router.post('/:interviewId/complete', protect, asyncHandler(completeInterview));

module.exports = router;
