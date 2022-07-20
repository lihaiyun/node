const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Video = db.define('video',
    {
        title: { type: Sequelize.STRING },
        story: { type: Sequelize.STRING(2000) },
        starring: { type: Sequelize.STRING },
        posterURL: { type: Sequelize.STRING },
        language: { type: Sequelize.STRING },
        subtitles: { type: Sequelize.STRING },
        classification: { type: Sequelize.STRING },
        dateRelease: { type: Sequelize.DATE }
    });

module.exports = Video;