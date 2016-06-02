#!/usr/bin/env node

// load modules
const Twit = require('twit');
const config = require('./config.js');
const util = require('./tweet-util.js');

// connect to twitter
var T = new Twit(config.creds);

// randomly choose either lefty or righty
var tmp = Math.floor(Math.random() * config.img_paths.length);
var img_path = config.img_paths[tmp];

// get the newest image
var img = util.newest_img(img_path);

// tweet it out
util.tweet_with_media(T, img);