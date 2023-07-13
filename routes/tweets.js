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
				const tweets = data.map((tweet) => ({
					description: tweet.description,
					date: tweet.date,
					username: tweet.author.username,
					firstname: tweet.author.firstname,
					hashtag: tweet.hashtag,
				}));
				res.json({ result: true, tweets });
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
				author: data._id,
			});

			newTweet.save().then((newTweet) => {
				res.json({ result: true, tweet: newTweet });
			});
		} else {
			res.json({ result: false });
		}
	});
});

/* Get /:hashtag - Find and return specific tweets */
router.get('/:hashtag', (req, res) => {
	const { hashtag } = req.params;

	Tweet.find({ hashtag })
		.populate('author')
		.then((data) => {
			if (data) {
				console.log('Test : ', data);
				const tweets = data.map((tweet) => ({
					description: tweet.description,
					date: tweet.date,
					username: tweet.author.username,
					firstname: tweet.author.firstname,
					hashtag: tweet.hashtag,
				}));
				console.log(tweets);
				res.json({ result: true, tweets });
			} else {
				res.json({ result: false });
			}
		});
});

module.exports = router;
