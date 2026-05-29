// Constants used throughout the application

const DOMAINS = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  DEVOPS: 'devops',
  GENERAL: 'general'
};

const DOMAINS_ARRAY = Object.values(DOMAINS);

const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

const DIFFICULTY_ARRAY = Object.values(DIFFICULTY_LEVELS);

const QUESTION_TYPES = {
  TECHNICAL: 'technical',
  BEHAVIORAL: 'behavioral',
  MIXED: 'mixed'
};

const QUESTION_TYPES_ARRAY = Object.values(QUESTION_TYPES);

const INTERVIEW_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned'
};

const INTERVIEW_STATUS_ARRAY = Object.values(INTERVIEW_STATUS);

const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

const USER_ROLES_ARRAY = Object.values(USER_ROLES);

const ANSWER_TYPES = {
  TEXT: 'text',
  VOICE: 'voice'
};

const ANSWER_TYPES_ARRAY = Object.values(ANSWER_TYPES);

const GRADES = {
  EXCELLENT: 'A+',
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  FAIL: 'F'
};

const GRADES_ARRAY = Object.values(GRADES);

const RESOURCE_TYPES = {
  ARTICLE: 'article',
  VIDEO: 'video',
  COURSE: 'course',
  BOOK: 'book',
  DOCUMENTATION: 'documentation'
};

const RESOURCE_TYPES_ARRAY = Object.values(RESOURCE_TYPES);

const PRIORITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

const PRIORITY_LEVELS_ARRAY = Object.values(PRIORITY_LEVELS);

const PASS_PERCENTAGE = 60;
const MIN_PASSWORD_LENGTH = 8;
const DEFAULT_TIME_LIMIT = 1800;
const DEFAULT_TIME_PER_QUESTION = 120;

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

module.exports = {
  DOMAINS,
  DOMAINS_ARRAY,
  DIFFICULTY_LEVELS,
  DIFFICULTY_ARRAY,
  QUESTION_TYPES,
  QUESTION_TYPES_ARRAY,
  INTERVIEW_STATUS,
  INTERVIEW_STATUS_ARRAY,
  USER_ROLES,
  USER_ROLES_ARRAY,
  ANSWER_TYPES,
  ANSWER_TYPES_ARRAY,
  GRADES,
  GRADES_ARRAY,
  RESOURCE_TYPES,
  RESOURCE_TYPES_ARRAY,
  PRIORITY_LEVELS,
  PRIORITY_LEVELS_ARRAY,
  PASS_PERCENTAGE,
  MIN_PASSWORD_LENGTH,
  DEFAULT_TIME_LIMIT,
  DEFAULT_TIME_PER_QUESTION,
  HTTP_STATUS
};
