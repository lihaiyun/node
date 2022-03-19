const express = require('express');
const router = express.Router();
const moment = require('moment');
const Video = require('../models/Video');
const ensureAuthenticated = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');

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
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let language = req.body.language.toString();
    // Multi-value components return array of strings or undefined
    let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString();
    let classification = req.body.classification;
    let userId = req.user.id;

    Video.create(
        { title, story, classification, language, subtitles, dateRelease, userId }
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
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let language = req.body.language.toString();
    let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString();
    let classification = req.body.classification;

    Video.update(
        { title, story, classification, language, subtitles, dateRelease },
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

module.exports = router;