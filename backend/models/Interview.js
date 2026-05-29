const mongoose = require('mongoose');
const { DOMAINS_ARRAY, DIFFICULTY_ARRAY, INTERVIEW_STATUS_ARRAY, ANSWER_TYPES_ARRAY } = require('../utils/constants');

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Interview must belong to a user']
    },

    domain: {
      type: String,
      required: [true, 'Please select an interview domain'],
      enum: DOMAINS_ARRAY
    },

    difficulty: {
      type: String,
      required: [true, 'Please select difficulty level'],
      enum: DIFFICULTY_ARRAY,
      default: 'medium'
    },

    questions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          default: null
        },
        questionText: {
          type: String,
          required: true
        },
        expectedAnswer: {
          type: String,
          default: null
        },
        userAnswer: {
          type: String,
          default: ''
        },
        answerType: {
          type: String,
          enum: ANSWER_TYPES_ARRAY,
          default: 'text'
        },
        audioUrl: {
          type: String,
          default: null
        },
        score: {
          type: Number,
          min: 0,
          max: 10,
          default: 0
        },
        feedback: {
          type: String,
          default: ''
        },
        evaluation: {
          type: mongoose.Schema.Types.Mixed,
          default: null
        },
        expectedTopics: {
          type: [String],
          default: []
        },
        evaluationCriteria: {
          type: [String],
          default: []
        },
        keywordsMatched: {
          type: [String],
          default: []
        },
        similarityScore: {
          type: Number,
          min: 0,
          max: 1,
          default: 0
        },
        timeTaken: {
          type: Number,
          default: 0
        }
      }
    ],

    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
      max: 20
    },

    questionsAnswered: {
      type: Number,
      default: 0
    },

    overallScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },

    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },

    status: {
      type: String,
      enum: INTERVIEW_STATUS_ARRAY,
      default: 'pending'
    },

    totalTimeTaken: {
      type: Number,
      default: 0
    },

    timeLimit: {
      type: Number,
      default: 1800
    },

    overallFeedback: {
      type: String,
      default: ''
    },

    strengths: {
      type: [String],
      default: []
    },

    weaknesses: {
      type: [String],
      default: []
    },

    recommendations: {
      type: [
        {
          topic: String,
          resource: String,
          url: String
        }
      ],
      default: []
    },

    startedAt: {
      type: Date,
      default: null
    },

    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

interviewSchema.virtual('passed').get(function () {
  return this.percentage >= 60;
});

interviewSchema.virtual('grade').get(function () {
  if (this.percentage >= 90) return 'A+';
  if (this.percentage >= 80) return 'A';
  if (this.percentage >= 70) return 'B';
  if (this.percentage >= 60) return 'C';
  if (this.percentage >= 50) return 'D';
  return 'F';
});

interviewSchema.index({ user: 1, createdAt: -1 });
interviewSchema.index({ status: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
