const mongoose = require('mongoose');

// Setup Environment Variables
require('dotenv').config();
const PORT = process.env.PORT || 5000;

// Setup Database
const connectDatabase = async (app) => {
  try {
    await mongoose.connect(process.env.DB_URI, () => {
      console.log('Connected to database...');
      app.listen(PORT, () =>
        console.log(`Server listening on localhost:${PORT}...`)
      );
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDatabase };