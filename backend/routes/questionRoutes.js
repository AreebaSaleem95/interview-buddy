const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { getConfig } = require('../config/env');
const {
  createQuestion,
  seedQuestions,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  deactivateQuestion,
  getRandomQuestions
} = require('../controllers/questionController');

const config = getConfig();
const seedAuth = config.isProduction ? [protect, authorize('admin')] : [];

router.get('/', asyncHandler(getQuestions));
router.post('/seed', ...seedAuth, asyncHandler(seedQuestions));
router.post('/random', asyncHandler(getRandomQuestions));
router.get('/:id', asyncHandler(getQuestionById));

router.post('/', protect, authorize('admin'), asyncHandler(createQuestion));
router.put('/:id', protect, authorize('admin'), asyncHandler(updateQuestion));
router.delete('/:id', protect, authorize('admin'), asyncHandler(deleteQuestion));
router.patch('/:id/deactivate', protect, authorize('admin'), asyncHandler(deactivateQuestion));

module.exports = router;
