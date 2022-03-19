const express = require('express');
const router = express.Router();

router.get('/listVideos', (req, res) => {
    res.render('video/listVideos');
});

module.exports = router;