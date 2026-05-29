const Question = require('../models/Question');
const seedData = require('./seedQuestionData');

async function seedQuestionsCollection() {
  const count = await Question.countDocuments();
  if (count > 0) {
    return [];
  }
  const docs = seedData.map((row) => ({
    question: row.title,
    type: row.type,
    domain: row.domain,
    difficulty: row.difficulty,
    expectedAnswer: row.expectedAnswer,
    isActive: true
  }));
  return Question.insertMany(docs);
}

module.exports = { seedQuestionsCollection };
