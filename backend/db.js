// Load environment variables
require('dotenv').config();

const { Sequelize } = require('sequelize');

// Use environment variables for database configuration
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: console.log, // Enable logging
});

module.exports = sequelize;
