const mongoose = require('mongoose');

const tweetsSchema = mongoose.Schema({
	description: String,
	date: { type: Date, default: new Date() },
});

const userSchema = mongoose.Schema({
	firstname: String,
	username: String,
	password: String,
	token: String,
	tweets: [tweetsSchema],
});

const User = mongoose.model('users', userSchema);

module.exports = User;
