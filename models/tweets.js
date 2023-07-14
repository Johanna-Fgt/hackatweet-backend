const mongoose = require('mongoose');

const tweetsSchema = mongoose.Schema({
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
	description: String,
	hashtag: [{ type: String, default: ' ' }],
	isLikedCount: { type: Number, default: 0 },
	date: { type: Date, default: new Date() },
});

const Tweet = mongoose.model('tweets', tweetsSchema);

module.exports = Tweet;
