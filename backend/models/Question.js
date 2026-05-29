const mongoose = require('mongoose');
const { DOMAINS_ARRAY, DIFFICULTY_ARRAY, QUESTION_TYPES_ARRAY } = require('../utils/constants');

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      minlength: [10, 'Question must be at least 10 characters long'],
      maxlength: [1000, 'Question cannot exceed 1000 characters']
    },

    domain: {
      type: String,
      required: [true, 'Please specify question domain'],
      enum: DOMAINS_ARRAY
    },

    subCategory: {
      type: String,
      trim: true,
      default: null
    },

    difficulty: {
      type: String,
      required: [true, 'Please specify difficulty level'],
      enum: DIFFICULTY_ARRAY,
      default: 'medium'
    },

    expectedAnswer: {
      type: String,
      trim: true,
      minlength: [20, 'Expected answer must be at least 20 characters'],
      maxlength: [2000, 'Expected answer cannot exceed 2000 characters']
    },

    keyPoints: {
      type: [String],
      default: []
    },

    keywords: {
      type: [String],
      default: []
    },

    type: {
      type: String,
      enum: QUESTION_TYPES_ARRAY,
      default: 'technical'
    },

    timeAllocation: {
      type: Number,
      default: 120,
      min: 30,
      max: 600
    },

    maxScore: {
      type: Number,
      default: 10,
      min: 1,
      max: 10
    },

    hints: {
      type: [String],
      default: []
    },

    tags: {
      type: [String],
      default: []
    },

    usageCount: {
      type: Number,
      default: 0
    },

    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isAIGenerated: {
      type: Boolean,
      default: false
    },

    source: {
      type: String,
      default: null
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    notes: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

questionSchema.virtual('title').get(function () {
  return this.question;
});

questionSchema.virtual('difficultyScore').get(function () {
  const difficultyMap = { easy: 1, medium: 2, hard: 3 };
  return difficultyMap[this.difficulty];
});

questionSchema.methods.incrementUsage = async function () {
  this.usageCount += 1;
  await this.save();
};

questionSchema.methods.updateAverageScore = async function (newScore) {
  const oldTotal = this.averageScore * (this.usageCount - 1);
  this.averageScore = (oldTotal + newScore) / this.usageCount;
  this.averageScore = Math.round(this.averageScore * 100) / 100;
  await this.save();
};

questionSchema.statics.getRandomQuestions = async function (domain, difficulty, count, questionType = null) {
  const filter = { domain, isActive: true };
  if (difficulty) filter.difficulty = difficulty;
  if (questionType) filter.type = questionType;
  const matchCount = await this.countDocuments(filter);
  const sampleSize = Math.min(count, matchCount);
  if (sampleSize === 0) {
    return [];
  }
  const questions = await this.aggregate([{ $match: filter }, { $sample: { size: sampleSize } }]);
  return questions;
};

questionSchema.statics.getPopularQuestions = async function (domain, limit = 10) {
  return await this.find({ domain, isActive: true })
    .sort({ usageCount: -1 })
    .limit(limit);
};

questionSchema.index({ domain: 1, difficulty: 1, type: 1 });
questionSchema.index({ isActive: 1 });

module.exports = mongoose.model('Question', questionSchema);
