const Interview = require('../models/Interview');
const Question = require('../models/Question');
const User = require('../models/User');
const Result = require('../models/Result');
const aiService = require('../services/aiService');
const { createInterviewValidation, paginationValidation } = require('../utils/validation');

const startInterview = async (req, res, next) => {
  try {
    const { error, value } = createInterviewValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        data: null
      });
    }

    const { domain, difficulty, numberOfQuestions, type: questionType } = value;

    let interviewQuestions = [];
    
    // Attempt dynamic AI-powered question generation
    const aiPromises = Array.from({ length: numberOfQuestions }).map(() =>
      aiService.generateQuestion(domain, difficulty)
    );
    const aiResults = await Promise.all(aiPromises);
    const generatedQuestions = aiResults
      .filter(res => res.success && res.data)
      .map(res => ({
        questionText: res.data.question,
        expectedTopics: res.data.expectedTopics || [],
        evaluationCriteria: res.data.evaluationCriteria || [],
        score: 0,
        feedback: ''
      }));

    if (generatedQuestions.length === numberOfQuestions) {
      interviewQuestions = generatedQuestions;
    } else {
      // Fallback: load static questions from MongoDB
      const activeTotal = await Question.countDocuments({ isActive: true });
      if (activeTotal === 0) {
        return res.status(400).json({
          success: false,
          message: 'No questions found. Please seed the database first.',
          data: null
        });
      }

      const questions = await Question.getRandomQuestions(
        domain,
        difficulty,
        numberOfQuestions,
        questionType || null
      );

      if (questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No questions available for the selected criteria',
          data: null
        });
      }

      interviewQuestions = questions.map(q => ({
        questionId: q._id,
        questionText: q.question,
        expectedAnswer: q.expectedAnswer,
        expectedTopics: [domain, difficulty],
        evaluationCriteria: ['Technical accuracy', 'Trade-offs']
      }));
    }

    const interview = await Interview.create({
      user: req.user._id,
      domain,
      difficulty,
      questions: interviewQuestions,
      totalQuestions: interviewQuestions.length,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Interview started successfully',
      data: {
        interviewId: interview._id,
        totalQuestions: interview.totalQuestions,
        timeLimit: interview.timeLimit,
        questions: interview.questions.map(q => ({
          id: q._id,
          questionId: q.questionId || null,
          questionText: q.questionText,
          expectedTopics: q.expectedTopics || []
        }))
      }
    });

  } catch (error) {
    next(error);
  }
};

const getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('user', 'name email')
      .populate('questions.questionId');

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
        message: 'You do not have permission to view this interview',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: interview
    });

  } catch (error) {
    next(error);
  }
};

const getUserInterviews = async (req, res, next) => {
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

    const interviews = await Interview.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('domain difficulty status overallScore percentage grade createdAt completedAt');

    const count = await Interview.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        interviews,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalInterviews: count
      }
    });

  } catch (error) {
    next(error);
  }
};

const submitAnswer = async (req, res, next) => {
  try {
    const { interviewId } = req.params;
    const { questionIndex, answer, timeTaken } = req.body;

    if (questionIndex === undefined || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Question index and answer are required',
        data: null
      });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
        data: null
      });
    }

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to submit answers for this interview',
        data: null
      });
    }

    if (questionIndex < 0 || questionIndex >= interview.questions.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question index',
        data: null
      });
    }

    const currentQuestion = interview.questions[questionIndex];
    currentQuestion.userAnswer = answer;
    currentQuestion.timeTaken = timeTaken || 0;
    interview.status = 'in-progress';

    // Call the AI Service to grade the answer
    const evalRes = await aiService.evaluateAnswer({
      question: currentQuestion.questionText,
      answer: answer.trim(),
      difficulty: interview.difficulty,
      domain: interview.domain,
      expectedTopics: currentQuestion.expectedTopics || [],
      evaluationCriteria: currentQuestion.evaluationCriteria || []
    });

    let score = 0;
    let feedback = '';
    let evaluationObj = null;

    if (evalRes.success && evalRes.data) {
      score = evalRes.data.score;
      feedback = evalRes.data.feedback;
      evaluationObj = evalRes.data;
    } else {
      // Heuristic fallback scoring logic
      if (answer.trim().length >= 10) {
        const answerLower = answer.toLowerCase();
        
        // 1. Length factor (0-3)
        if (answer.length > 50) score += 1;
        if (answer.length > 150) score += 1;
        if (answer.length > 300) score += 1;

        // 2. Keyword relevance (0-5)
        const expectedAns = currentQuestion.expectedAnswer || '';
        const expectedWords = expectedAns.toLowerCase().split(/\s+/).filter(w => w.length > 4);
        let matches = 0;
        expectedWords.forEach(w => {
          if (answerLower.includes(w)) matches++;
        });
        if (expectedWords.length > 0) {
          const ratio = matches / expectedWords.length;
          score += Math.min(5, Math.ceil(ratio * 5));
        } else {
          score += 2;
        }

        // 3. Domain detection (0-2)
        const techTerms = {
          frontend: ['react', 'dom', 'css', 'html', 'state', 'props', 'component', 'browser', 'api', 'hook', 'render'],
          backend: ['node', 'database', 'sql', 'api', 'server', 'express', 'auth', 'query', 'nosql', 'rest', 'model'],
          devops: ['docker', 'kubernetes', 'ci/cd', 'pipeline', 'cloud', 'aws', 'deploy', 'linux', 'container', 'scale'],
          general: ['project', 'team', 'agile', 'conflict', 'solution', 'goal', 'leadership', 'plan']
        };
        const domainTerms = techTerms[interview.domain] || techTerms.general;
        let termMatches = 0;
        domainTerms.forEach(term => {
          if (answerLower.includes(term)) termMatches++;
        });
        if (termMatches > 0) score += 1;
        if (termMatches > 2) score += 1;

        score = Math.min(10, Math.max(1, score));
      }

      if (score === 0) feedback = 'Answer is too short or missing.';
      else if (score >= 8) feedback = 'Excellent answer! (Fallback evaluation)';
      else if (score >= 5) feedback = 'Good effort, could use more detail. (Fallback evaluation)';
      else feedback = 'Please write a more robust answer. (Fallback evaluation)';

      evaluationObj = {
        score,
        feedback,
        strengths: score >= 6 ? ['Gave a structured response'] : [],
        improvements: score < 7 ? ['Explain architectural trade-offs'] : [],
        accuracy: score >= 7 ? 'high' : 'medium',
        clarity: score >= 6 ? 'high' : 'medium',
        completeness: 'medium',
        ideal_answer: currentQuestion.expectedAnswer || 'No model response available.'
      };
    }

    currentQuestion.score = score;
    currentQuestion.feedback = feedback;
    currentQuestion.evaluation = evaluationObj;

    const answeredCount = interview.questions.filter(q => q.userAnswer).length;
    interview.questionsAnswered = answeredCount;

    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Answer submitted successfully',
      data: {
        questionsAnswered: interview.questionsAnswered,
        totalQuestions: interview.totalQuestions,
        evaluation: evaluationObj
      }
    });

  } catch (error) {
    next(error);
  }
};

const completeInterview = async (req, res, next) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
        data: null
      });
    }

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to complete this interview',
        data: null
      });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'This interview is already completed',
        data: null
      });
    }

    interview.status = 'completed';
    interview.completedAt = new Date();

    let totalScore = 0;
    interview.questions.forEach(q => {
      totalScore += q.score;
    });

    interview.overallScore = totalScore / interview.questions.length;
    interview.percentage = (interview.overallScore / 10) * 100;
    interview.totalTimeTaken = interview.questions.reduce((sum, q) => sum + (q.timeTaken || 0), 0);

    // Call AI service to generate a comprehensive report
    const questionsPayload = interview.questions.map(q => ({
      question: q.questionText,
      answer: q.userAnswer || '',
      score: q.score,
      feedback: q.feedback
    }));

    const reportRes = await aiService.generateReport(questionsPayload);

    if (reportRes.success && reportRes.data) {
      interview.overallFeedback = reportRes.data.overallFeedback;
      interview.strengths = reportRes.data.strengths || [];
      interview.weaknesses = reportRes.data.weaknesses || [];
      interview.recommendations = reportRes.data.recommendations || [];
    } else {
      interview.overallFeedback = `Interview completed with ${interview.percentage.toFixed(1)}% score.`;
      interview.strengths = interview.questions.filter(q => q.score >= 7).map(q => q.questionText);
      interview.weaknesses = interview.questions.filter(q => q.score <= 4).map(q => q.questionText);
      interview.recommendations = [];
    }

    await interview.save();

    const passed = interview.percentage >= 60;
    let grade;
    if (interview.percentage >= 90) grade = 'A+';
    else if (interview.percentage >= 80) grade = 'A';
    else if (interview.percentage >= 70) grade = 'B';
    else if (interview.percentage >= 60) grade = 'C';
    else if (interview.percentage >= 50) grade = 'D';
    else grade = 'F';

    // Check if result already exists before creating
    let existingResult = await Result.findOne({ interview: interview._id });
    if (!existingResult) {
      existingResult = await Result.create({
        interview: interview._id,
        user: interview.user,
        overallScore: interview.overallScore,
        percentage: interview.percentage,
        grade,
        passed,
        feedback: {
          summary: interview.overallFeedback || `Interview completed with ${interview.percentage.toFixed(1)}% score`,
          strengths: interview.strengths?.length ? interview.strengths : interview.questions.filter(q => q.score >= 7).map(q => q.questionText),
          weaknesses: interview.weaknesses?.length ? interview.weaknesses : interview.questions.filter(q => q.score <= 4).map(q => q.questionText),
          suggestions: interview.recommendations?.map(r => r.topic) || []
        },
        timeAnalysis: {
          totalTime: interview.totalTimeTaken
        }
      });
    }

    // Update user stats
    if (req.user.updateStats && typeof req.user.updateStats === 'function') {
      await req.user.updateStats(interview.overallScore);
    }

    res.status(200).json({
      success: true,
      message: 'Interview completed successfully',
      data: {
        overallScore: interview.overallScore,
        percentage: interview.percentage,
        grade,
        passed
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  startInterview,
  getInterviewById,
  getUserInterviews,
  submitAnswer,
  completeInterview
};
