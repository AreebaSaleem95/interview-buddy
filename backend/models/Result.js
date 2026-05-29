const mongoose = require('mongoose');
const { GRADES_ARRAY, RESOURCE_TYPES_ARRAY, PRIORITY_LEVELS_ARRAY } = require('../utils/constants');

const resultSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: [true, 'Result must be linked to an interview'],
      unique: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Result must belong to a user']
    },

    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    grade: {
      type: String,
      enum: GRADES_ARRAY,
      required: true
    },

    passed: {
      type: Boolean,
      required: true
    },

    metrics: {
      avgResponseTime: {
        type: Number,
        default: 0
      },
      completionRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      keywordMatchRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      avgSimilarity: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      },
      voiceAnswers: {
        type: Number,
        default: 0
      },
      textAnswers: {
        type: Number,
        default: 0
      }
    },

    scoreByDifficulty: {
      easy: {
        attempted: { type: Number, default: 0 },
        correct: { type: Number, default: 0 },
        avgScore: { type: Number, default: 0 }
      },
      medium: {
        attempted: { type: Number, default: 0 },
        correct: { type: Number, default: 0 },
        avgScore: { type: Number, default: 0 }
      },
      hard: {
        attempted: { type: Number, default: 0 },
        correct: { type: Number, default: 0 },
        avgScore: { type: Number, default: 0 }
      }
    },

    feedback: {
      summary: {
        type: String,
        required: true
      },
      strengths: {
        type: [String],
        default: []
      },
      weaknesses: {
        type: [String],
        default: []
      },
      suggestions: {
        type: [String],
        default: []
      }
    },

    recommendations: [
      {
        topic: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        resources: [
          {
            title: String,
            type: {
              type: String,
              enum: RESOURCE_TYPES_ARRAY
            },
            url: String,
            duration: String
          }
        ],
        priority: {
          type: String,
          enum: PRIORITY_LEVELS_ARRAY,
          default: 'medium'
        }
      }
    ],

    skillsAssessed: [
      {
        skillName: {
          type: String,
          required: true
        },
        score: {
          type: Number,
          min: 0,
          max: 10,
          required: true
        },
        level: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
        }
      }
    ],

    percentile: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },

    domainRank: {
      type: Number,
      default: null
    },

    timeAnalysis: {
      totalTime: {
        type: Number,
        required: true
      },
      timePerQuestion: {
        type: Number,
        default: 0
      },
      efficiency: {
        type: String,
        enum: ['Excellent', 'Good', 'Average', 'Needs Improvement'],
        default: 'Average'
      }
    },

    certificateEligible: {
      type: Boolean,
      default: false
    },

    certificateId: {
      type: String,
      default: null
    },

    isViewed: {
      type: Boolean,
      default: false
    },

    viewedAt: {
      type: Date,
      default: null
    },

    adminNotes: {
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

resultSchema.virtual('performanceLevel').get(function () {
  if (this.percentage >= 90) return 'Outstanding';
  if (this.percentage >= 80) return 'Excellent';
  if (this.percentage >= 70) return 'Good';
  if (this.percentage >= 60) return 'Satisfactory';
  if (this.percentage >= 50) return 'Below Average';
  return 'Needs Improvement';
});

resultSchema.methods.markAsViewed = async function () {
  if (!this.isViewed) {
    this.isViewed = true;
    this.viewedAt = new Date();
    await this.save();
  }
};

resultSchema.index({ user: 1, createdAt: -1 });
resultSchema.index({ interview: 1 });

module.exports = mongoose.model('Result', resultSchema);
