const axios = require('axios');
const logger = require('../config/logger');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Generate a dynamic scenario question using AI.
 */
const generateQuestion = async (domain, difficulty, topic = null) => {
  try {
    const res = await axios.post(`${AI_SERVICE_URL}/generate-question`, {
      domain,
      difficulty,
      topic
    }, { timeout: 8000 });

    if (res.data && res.data.question) {
      return {
        success: true,
        data: res.data
      };
    }
  } catch (err) {
    logger.warn('AI generate-question call failed, falling back to local database pool.', {
      message: err.message,
      url: AI_SERVICE_URL
    });
  }
  return { success: false, data: null };
};

/**
 * Evaluate a single answer response using AI.
 */
const evaluateAnswer = async (questionData) => {
  try {
    const res = await axios.post(`${AI_SERVICE_URL}/evaluate-answer`, {
      question: questionData.question,
      answer: questionData.answer,
      difficulty: questionData.difficulty,
      domain: questionData.domain,
      expectedTopics: questionData.expectedTopics || [],
      evaluationCriteria: questionData.evaluationCriteria || []
    }, { timeout: 10000 });

    if (res.data && res.data.score !== undefined) {
      return {
        success: true,
        data: res.data
      };
    }
  } catch (err) {
    logger.warn('AI evaluate-answer call failed, falling back to local heuristic rules.', {
      message: err.message,
      url: AI_SERVICE_URL
    });
  }
  return { success: false, data: null };
};

/**
 * Generate comprehensive final report summarizing the session.
 */
const generateReport = async (questionsList) => {
  try {
    const res = await axios.post(`${AI_SERVICE_URL}/generate-report`, {
      questions: questionsList
    }, { timeout: 12000 });

    if (res.data && res.data.overallFeedback) {
      return {
        success: true,
        data: res.data
      };
    }
  } catch (err) {
    logger.warn('AI generate-report call failed, falling back to local heuristics.', {
      message: err.message,
      url: AI_SERVICE_URL
    });
  }
  return { success: false, data: null };
};

module.exports = {
  generateQuestion,
  evaluateAnswer,
  generateReport
};
