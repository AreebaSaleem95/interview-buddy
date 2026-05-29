require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/database');
const { seedQuestionsCollection } = require('../utils/runSeedQuestions');

async function main() {
  await connectDB();

  const inserted = await seedQuestionsCollection();
  console.log(`Seeded ${inserted.length} questions`);

  await disconnectDB();
  process.exit(0);
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.connection.close();
  } catch (_) {
    /* ignore */
  }
  process.exit(1);
});
