// load modules
const Twit = require('twit');
const config = require('./config.js');
const util = require('./tweet-util.js');

var bot = { };

bot.start = function () {

    // Create Twitter object
    var T = new Twit(config.creds);
    console.log(config.img_path);

    // Define which Twitter handle to track 
    var screen_name = 'O_R_G_pps';

    // Create a Twitter User Stream connection
    var user_stream   = T.stream('user');

    // Listen for replies
    user_stream.on('tweet', function (tweet) {
        var i, mentions, b64content, text, id;
        mentions = tweet.entities.user_mentions;
        id = tweet.id_str;
        text = ".@" + tweet.user.screen_name;
        console.log(text);
        for (i = 0; i < mentions.length; i++) {
            if (mentions[i].screen_name == screen_name) {
                // post an image
                var img = util.newest_img(config.img_path);
                util.tweet_with_media(T, img, text, id);
            }
        }
    });

  user_stream.on('connected', function (request) {
    console.log('Connected.');
  });

  user_stream.on('reconnect', function (request, response, connectInterval) {
    console.log('Reconnecting...');
  });

  user_stream.on('direct_message', function (directMsg) {
    console.log(directMsg);
    // TODO: Instead of printing, parse out what the user wants 
    // and then call one of the functions below that have yet to be defined
  });
}

bot.start();