const mongoose = require('mongoose');
const dotenv = require('dotenv');
const initScheduledJobs = require('./utils/cronJobs.js');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 - Shutting down...');
  console.log(err);

  process.exit(1);
});

dotenv.config({ path: './config.env' });
console.log("DB =", process.env.DB);
console.log("DB_PASSWORD =", process.env.DB_PASSWORD);
const app = require('./app');

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB Connection Successful!'));

const PORT = process.env.PORT || 5050;
const server = app.listen(PORT, () => {
  console.log(`App running on the port ${PORT}...`);

  // Set scheduler for events dates
  initScheduledJobs();
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 - Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
