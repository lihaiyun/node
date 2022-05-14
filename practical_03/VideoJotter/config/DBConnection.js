const myDatabase = require('./DBConfig');
const User = require('../models/User');
const Video = require('../models/Video');

// If drop is true, all existing tables are dropped and recreated 
const setUpDB = (drop) => {
    myDatabase.authenticate()
        .then(() => {
            console.log('Database connected');
            /* 
            Defines the relationship where a user has many videos. 
            The primary key from user will be a foreign key in video. 
            */
            User.hasMany(Video);
            Video.belongsTo(User);
            myDatabase.sync({
                force: drop
            });
        })
        .catch(err => console.log(err));
};

module.exports = { setUpDB };