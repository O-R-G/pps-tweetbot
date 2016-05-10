#!/usr/bin/env node

/*!
 * O_R_G_pps Bot
 *
 * This Node.js application tweets out a picture in response to an @ reply.
 *
 * For documentation, see the following:
 *   https://github.com/ttezel/twit#twit
 *   https://dev.twitter.com/streaming/userstreams
 *   https://t.co/TweetObject
 *
 * Before running:
 *   Create an app at t.co/apps to get consumer keys and generate access keys.
 *   Add these keys to your config.js file (if you have not created this yet, 
 *   copy config.sample.js to a file named config.js).
 *
 * To run:
 *   npm install twit (only required once)
 *   node userstream.js
 *
 * Based on Twitter Users Streams Example by @jbulava:
 *   https://github.com/jbulava/twitter-api-examples/blob/master/userstream.js
 */

// connect to the filesystem
const fs = require('fs');
// Config file for API keys
var config = require('./config.js'); 
// Requiring the Twit package
var TwitPackage = require('twit');
// Creating an instance of the Twit package
var T = new TwitPackage(config);     

// Define which Twitter handle to track 
var screen_name = 'O_R_G_pps';

// Create a Twitter User Stream connection
var user_stream   = T.stream('user');

// Listen for replies
user_stream.on('tweet', function (tweet) {
    var i, mentions, b64content;
    mentions = tweet.entities.user_mentions;
    
    for (i = 0; i < mentions.length; i++) {
        if (mentions[i].screen_name == screen_name) {
            // post an image
            tweet_with_media('./images/00001.png');
        }
    }
});

// post a tweet to the authorised user's account
// status will be empty aside from the media file provided
function tweet_with_media(file)
{
    var b64_data, params; 
    b64_data = fs.readFileSync(file, { encoding: 'base64' });
    params = { media_data: b64_data };
    
    T.post('media/upload', params, function (e, d, r) {
        var meta_params = { media_id: d.media_id_string };
        meta_params.image = { image_type: "image/png" };
        T.post('media/metadata/create', meta_params, function (e, d, r) {
            if (!e) {
                var params = { status: '', media_ids: [meta_params.media_id] };
                T.post('statuses/update', params, function (e, d, r) {
                    console.log(d);
                });
            }
            else {
                console.log(e);
            }
        });
    });
}
