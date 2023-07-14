var express = require('express');
var router = express.Router();
const User = require('../models/users');
const Tweet = require('../models/tweets');
const { checkBody } = require('../modules/checkBody');

/* GET / - Find all tweets + return all tweets */
router.get('/', (req, res) => {
	Tweet.find()
		.populate('author')
		.then((data) => {
			if (data) {
				res.json({ result: true, tweets: data });
			} else {
				res.json({ result: false });
			}
		});
});

/* POST /new - Create a new Tweet */
router.post('/new', (req, res) => {
	const { description, hashtag, token } = req.body;
	// Check if all user's informations are fulfilled
	if (!checkBody(req.body, ['description'])) {
		res.json({ result: false, error: 'Missing or empty field' });
		return;
	}

	User.findOne({ token }).then((data) => {
		if (data) {
			const newTweet = new Tweet({
				description,
				hashtag,
				date: new Date(),
				author: data._id,
			});

			newTweet
				.save()
				.then((data) => res.json({ result: true, date: data.date }));
		} else {
			res.json({ result: false });
		}
	});
});

/* UPDATE /:id - Update likes counter */
router.put('/update/:id', (req, res) => {
	const { id } = req.params;
	const { token } = req.body;

	Tweet.findById(id).then((tweet) => {
		if (tweet.isLikedBy.includes(token)) {
			Tweet.updateOne({ _id: id }, { $pull: { isLikedBy: token } }).then(
				(data) => {
					if (data.modifiedCount > 0) {
						res.json({ result: true });
					} else {
						res.json({ result: false });
					}
				}
			);
		} else {
			Tweet.updateOne({ _id: id }, { $addToSet: { isLikedBy: token } }).then(
				(data) => {
					if (data.modifiedCount > 0) {
						res.json({ result: true });
					} else {
						res.json({ result: false });
					}
				}
			);
		}
	});
});

/* DELETE /:id - Delete a specific tweet */
router.delete('/delete/:id', (req, res) => {
	const { id } = req.params;
	const { token } = req.body;

	User.findOne({ token }).then((data) => {
		if (!data) {
			res.json({ result: false });
			return;
		}
	});

	Tweet.deleteOne({ _id: id }).then((data) => {
		if (data.deletedCount > 0) {
			res.json({ result: true });
		} else {
			res.json({ result: false });
		}
	});
});

module.exports = router;
