const Question = require('../models/Question');
const { createQuestionValidation, paginationValidation } = require('../utils/validation');
const { seedQuestionsCollection } = require('../utils/runSeedQuestions');

const normalizeQuestionPayload = (value) => {
  const payload = { ...value };
  if (payload.title && !payload.question) {
    payload.question = payload.title;
  }
  delete payload.title;
  return payload;
};

const createQuestion = async (req, res, next) => {
  try {
    const { error, value } = createQuestionValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        data: null
      });
    }

    const questionData = {
      ...normalizeQuestionPayload(value),
      createdBy: req.user._id
    };

    const question = await Question.create(questionData);

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question
    });

  } catch (error) {
    next(error);
  }
};

const seedQuestions = async (req, res, next) => {
  try {
    const inserted = await seedQuestionsCollection();
    res.status(201).json({
      success: true,
      message: `Seeded ${inserted.length} questions`,
      data: { count: inserted.length }
    });
  } catch (error) {
    next(error);
  }
};

const getQuestions = async (req, res, next) => {
  try {
    const { error, value } = paginationValidation(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        data: null
      });
    }

    const { page, limit } = value;
    const { domain, difficulty, isActive } = req.query;

    const filter = {};
    if (domain) filter.domain = domain;
    if (difficulty) filter.difficulty = difficulty;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Question.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        questions,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalQuestions: count
      }
    });

  } catch (error) {
    next(error);
  }
};

const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: question
    });

  } catch (error) {
    next(error);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    const { error, value } = createQuestionValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        data: null
      });
    }

    const updateData = {
      ...normalizeQuestionPayload(value),
      updatedBy: req.user._id
    };

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: question
    });

  } catch (error) {
    next(error);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

const deactivateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedBy: req.user._id },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question deactivated successfully'
    });

  } catch (error) {
    next(error);
  }
};

const getRandomQuestions = async (req, res, next) => {
  try {
    const { domain, difficulty, type, limit = 5 } = req.body;
    
    if (!domain) {
      return res.status(400).json({
        success: false,
        message: 'Domain is required',
        data: null
      });
    }

    const count = parseInt(limit, 10);
    const questions = await Question.getRandomQuestions(domain, difficulty, count, type);

    res.status(200).json({
      success: true,
      data: questions
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuestion,
  seedQuestions,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  deactivateQuestion,
  getRandomQuestions
};
