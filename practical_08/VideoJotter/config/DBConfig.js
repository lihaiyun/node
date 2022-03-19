const Sequelize = require('sequelize');

require('dotenv').config();

// Instantiates Sequelize with database parameters 
const sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD,
    {
        host: process.env.DB_HOST, // Name or IP of MySQL server
        dialect: 'mysql', // Tells squelize that MySQL is used
        logging: false, // Disable logging; default: console.log
        pool: {
            max: 5, min: 0, acquire: 30000, idle: 10000
        },
        timezone: '+08:00'
    }
);
module.exports = sequelize;