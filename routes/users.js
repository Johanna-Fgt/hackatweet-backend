var express = require('express');
var router = express.Router();
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');

/* POST /signup -  Create new User in db + return token */
router.post('/signup', (req, res) => {
	const { firstname, username, password } = req.body;
	// Check if all user's informations are fulfilled
	if (!checkBody(req.body, ['firstname', 'username', 'password'])) {
		res.json({ result: false, error: 'Missing or empty fields' });
		return;
	}

	// Check if the user has not already been registered
	User.findOne({
		username: { $regex: new RegExp(username, 'i') },
	}).then((data) => {
		if (!data) {
			const hash = bcrypt.hashSync(password, 10);
			const newUser = new User({
				firstname,
				username,
				password: hash,
				token: uid2(32),
			});

			newUser.save().then((newUser) => {
				res.json({
					result: true,
					token: newUser.token,
					firstname: newUser.firstname,
					username: newUser.username,
					likedTweets: data.likedTweets,
				});
			});
		} else {
			// User already exists in database
			res.json({ result: false, error: 'User already exists' });
		}
	});
});

/* POST /signin -  Find User in db  + return token */
router.post('/signin', (req, res) => {
	const { username, password } = req.body;

	// Check if all user's informations are fulfilled
	if (!checkBody(req.body, ['username', 'password'])) {
		res.json({ result: false, error: 'Missing or empty fields' });
		return;
	}

	User.findOne({
		username: { $regex: new RegExp(username, 'i') },
	}).then((data) => {
		if (data && bcrypt.compareSync(password, data.password)) {
			res.json({
				result: true,
				token: data.token,
				firstname: data.firstname,
				username: data.username,
				likedTweets: data.likedTweets,
			});
		} else {
			res.json({ result: false, error: 'User not found or wrong password' });
		}
	});
});

// router.get('/canBookmark/:token', (req, res) => {
//   User.findOne({ token: req.params.token }).then(data => {
//     if (data) {
//       res.json({ result: true, canBookmark: data.canBookmark });
//     } else {
//       res.json({ result: false, error: 'User not found' });
//     }
//   });
// });

module.exports = router;
