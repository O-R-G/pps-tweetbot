#!/usr/bin/env node

// load modules
const Twit = require('twit');
const config = require('./config.js');
const util = require('./tweet-util.js');

// connect to twitter
var T = new Twit(config.creds);

// get image to tweet
var img = util.newest_img(config.img_path);

// tweet it out
util.tweet_with_media(T, img);