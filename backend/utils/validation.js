const Joi = require('joi');
const {
  MIN_PASSWORD_LENGTH,
  DOMAINS_ARRAY,
  DIFFICULTY_ARRAY,
  QUESTION_TYPES_ARRAY
} = require('./constants');

const domainList = DOMAINS_ARRAY.join(', ');
const difficultyList = DIFFICULTY_ARRAY.join(', ');
const questionTypeList = QUESTION_TYPES_ARRAY.join(', ');

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
    password: Joi.string()
      .min(MIN_PASSWORD_LENGTH)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain uppercase, lowercase, and a number',
        'string.min': `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
        'string.empty': 'Password is required'
      })
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    })
  });
  return schema.validate(data);
};

const createInterviewValidation = (data) => {
  const schema = Joi.object({
    domain: Joi.string()
      .valid(...DOMAINS_ARRAY)
      .required()
      .messages({
        'string.empty': 'Domain is required',
        'any.only': `Domain must be one of: ${domainList}`
      }),
    difficulty: Joi.string()
      .valid(...DIFFICULTY_ARRAY)
      .required()
      .messages({
        'string.empty': 'Difficulty level is required',
        'any.only': `Difficulty must be one of: ${difficultyList}`
      }),
    numberOfQuestions: Joi.number().integer().min(1).max(20).required().messages({
      'number.base': 'Number of questions must be a number',
      'number.min': 'At least 1 question is required',
      'number.max': 'Maximum 20 questions allowed'
    }),
    type: Joi.string()
      .valid(...QUESTION_TYPES_ARRAY)
      .optional()
      .messages({
        'any.only': `Type must be one of: ${questionTypeList}`
      })
  })
    .unknown(false)
    .messages({
      'object.unknown': '"{#key}" is not allowed'
    });

  return schema.validate(data);
};

const submitAnswerValidation = (data) => {
  const schema = Joi.object({
    questionId: Joi.string().required().messages({
      'string.empty': 'Question ID is required'
    }),
    answer: Joi.string().required().messages({
      'string.empty': 'Answer is required'
    }),
    timeTaken: Joi.number().min(0).required().messages({
      'number.min': 'Time taken cannot be negative'
    })
  });
  return schema.validate(data);
};

const createQuestionValidation = (data) => {
  const schema = Joi.object({
    question: Joi.string().min(10).required(),
    domain: Joi.string()
      .valid(...DOMAINS_ARRAY)
      .required(),
    difficulty: Joi.string()
      .valid(...DIFFICULTY_ARRAY)
      .required(),
    type: Joi.string()
      .valid(...QUESTION_TYPES_ARRAY)
      .required()
  }).unknown(false);

  return schema.validate(data);
};

const updateUserValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().optional(),
    education: Joi.string().optional(),
    preferredDomains: Joi.array().items(Joi.string().valid(...DOMAINS_ARRAY)).optional(),
    avatar: Joi.string().uri().optional()
  });
  return schema.validate(data);
};

const paginationValidation = (data) => {
  const schema = Joi.object({
    page: Joi.number().min(1).optional().default(1),
    limit: Joi.number().min(1).max(100).optional().default(10)
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  createInterviewValidation,
  submitAnswerValidation,
  createQuestionValidation,
  updateUserValidation,
  paginationValidation
};
