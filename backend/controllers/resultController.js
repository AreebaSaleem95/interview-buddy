const Interview = require('../models/Interview');
const Result = require('../models/Result');
const { paginationValidation } = require('../utils/validation');

const getInterviewResult = async (req, res, next) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId).populate('user');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
        data: null
      });
    }

    if (interview.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this result',
        data: null
      });
    }

    const result = await Result.findOne({ interview: interviewId });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found',
        data: null
      });
    }

    await result.markAsViewed();

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

const getUserResults = async (req, res, next) => {
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

    const results = await Result.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('interview', 'domain difficulty');

    const count = await Result.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        results,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalResults: count
      }
    });

  } catch (error) {
    next(error);
  }
};

const createResult = async (req, res, next) => {
  try {
    const { interviewId, feedback } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
        data: null
      });
    }

    const existingResult = await Result.findOne({ interview: interviewId });
    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: 'Result already exists for this interview',
        data: null
      });
    }

    const passed = interview.percentage >= 60;
    let grade;
    if (interview.percentage >= 90) grade = 'A+';
    else if (interview.percentage >= 80) grade = 'A';
    else if (interview.percentage >= 70) grade = 'B';
    else if (interview.percentage >= 60) grade = 'C';
    else if (interview.percentage >= 50) grade = 'D';
    else grade = 'F';

    const result = await Result.create({
      interview: interviewId,
      user: interview.user,
      overallScore: interview.overallScore,
      percentage: interview.percentage,
      grade,
      passed,
      feedback: feedback || {
        summary: `Interview completed with ${interview.percentage.toFixed(1)}% score`,
        strengths: [],
        weaknesses: [],
        suggestions: []
      },
      timeAnalysis: {
        totalTime: interview.totalTimeTaken
      }
    });

    res.status(201).json({
      success: true,
      message: 'Result created successfully',
      data: result
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInterviewResult,
  getUserResults,
  createResult
};
