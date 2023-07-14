const mongoose = require('mongoose');

const tweetsSchema = mongoose.Schema({
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
	description: String,
	hashtag: [{ type: String, default: ' ' }],
	isLikedBy: [{ type: String, default: ' ' }],
	date: { type: Date, default: new Date() },
});

const Tweet = mongoose.model('tweets', tweetsSchema);

module.exports = Tweet;
