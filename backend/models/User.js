const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { DOMAINS_ARRAY } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },

    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },

    phone: {
      type: String,
      trim: true,
      default: null
    },

    education: {
      type: String,
      trim: true,
      default: null
    },

    preferredDomains: {
      type: [String],
      enum: DOMAINS_ARRAY,
      default: []
    },

    totalInterviews: {
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

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    lastLogin: {
      type: Date,
      default: null
    },

    refreshTokens: [
      {
        token: String,
        expiresAt: Date,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.updateStats = async function (newScore) {
  this.totalInterviews += 1;
  const oldTotal = this.averageScore * (this.totalInterviews - 1);
  this.averageScore = (oldTotal + newScore) / this.totalInterviews;
  this.averageScore = Math.round(this.averageScore * 100) / 100;
  await this.save();
};

userSchema.virtual('experienceLevel').get(function () {
  if (this.totalInterviews === 0) return 'Beginner';
  if (this.totalInterviews < 5) return 'Intermediate';
  if (this.totalInterviews < 10) return 'Advanced';
  return 'Expert';
});

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
