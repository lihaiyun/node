const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	const title = 'Video Jotter';
	// renders views/index.handlebars, passing title as an object
	res.render('index', { title: title })
});

module.exports = router;
