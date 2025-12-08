const cron = require('node-cron');
const Event = require('../models/eventModel.js');

const updateExpiredEvents = async () => {
  console.log('📆 Running scheduled event status update ');
  await Event.updateMany(
    { date: { $lt: new Date() }, status: 'upcoming' },
    { $set: { status: 'completed' } }
  );
  console.log('📆 Expired events update complete ✅');
};

const initScheduledJobs = () => {
  // Schedule to run every day at 1:00 AM
  cron.schedule('0 1 * * *', updateExpiredEvents);
  console.log('📆 Cron job for expired events scheduled.');
};

module.exports = initScheduledJobs;
