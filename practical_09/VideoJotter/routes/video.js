const express = require('express');
const router = express.Router();
const moment = require('moment');
const Video = require('../models/Video');
const ensureAuthenticated = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');
require('dotenv').config();
const fetch = require('node-fetch');
// Required for file upload 
const fs = require('fs');
const upload = require('../helpers/imageUpload');

router.get('/listVideos', ensureAuthenticated, (req, res) => {
    Video.findAll({
        where: { userId: req.user.id },
        order: [['dateRelease', 'DESC']],
        raw: true
    })
        .then((videos) => {
            // pass object to listVideos.handlebar
            res.render('video/listVideos', { videos });
        })
        .catch(err => console.log(err));
});

router.get('/addVideo', ensureAuthenticated, (req, res) => {
    res.render('video/addVideo');
});

router.post('/addVideo', ensureAuthenticated, (req, res) => {
    let title = req.body.title;
    let story = req.body.story.slice(0, 1999);
    let starring = req.body.starring;
    let posterURL = req.body.posterURL;
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let language = req.body.language.toString();
    // Multi-value components return array of strings or undefined
    let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString();
    let classification = req.body.classification;
    let userId = req.user.id;

    Video.create(
        { title, story, starring, posterURL, classification, language, subtitles, dateRelease, userId }
    )
        .then((video) => {
            console.log(video.toJSON());
            res.redirect('/video/listVideos');
        })
        .catch(err => console.log(err))
});

router.get('/editVideo/:id', ensureAuthenticated, (req, res) => {
    Video.findByPk(req.params.id)
        .then((video) => {
            if (!video) {
                flashMessage(res, 'error', 'Video not found');
                res.redirect('/video/listVideos');
                return;
            }
            if (req.user.id != video.userId) {
                flashMessage(res, 'error', 'Unauthorised access');
                res.redirect('/video/listVideos');
                return;
            }

            res.render('video/editVideo', { video });
        })
        .catch(err => console.log(err));
});

router.post('/editVideo/:id', ensureAuthenticated, (req, res) => {
    let title = req.body.title;
    let story = req.body.story.slice(0, 1999);
    let starring = req.body.starring;
    let posterURL = req.body.posterURL;
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let language = req.body.language.toString();
    let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString();
    let classification = req.body.classification;

    Video.update(
        { title, story, starring, posterURL, classification, language, subtitles, dateRelease },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' video updated');
            res.redirect('/video/listVideos');
        })
        .catch(err => console.log(err));
});

router.get('/deleteVideo/:id', ensureAuthenticated, async function (req, res) {
    try {
        let video = await Video.findByPk(req.params.id);
        if (!video) {
            flashMessage(res, 'error', 'Video not found');
            res.redirect('/video/listVideos');
            return;
        }
        if (req.user.id != video.userId) {
            flashMessage(res, 'error', 'Unauthorised access');
            res.redirect('/video/listVideos');
            return;
        }

        let result = await Video.destroy({ where: { id: video.id } });
        console.log(result + ' video deleted');
        res.redirect('/video/listVideos');
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/omdb', ensureAuthenticated, (req, res) => {
    let apikey = process.env.OMDB_API_KEY;
    let title = req.query.title;
    fetch(`https://www.omdbapi.com/?t=${title}&apikey=${apikey}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            res.json(data);
        });
});

router.post('/upload', ensureAuthenticated, (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/' + req.user.id, { recursive: true });
    }

    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ err: err });
        }
        else if (req.file == undefined) {
            res.json({});
        }
        else {
            res.json({ file: `/uploads/${req.user.id}/${req.file.filename}` });
        }
    });
});

module.exports = router;