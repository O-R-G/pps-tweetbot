var Twit = require('twit');
var config = require('./config.js');

// var nconf = require('nconf');
// nconf.env().file({ file: 'config.json' });

// connect to the filesystem
const fs = require('fs');
const path = require('path');


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
        var i, mentions, b64content;
        mentions = tweet.entities.user_mentions;
    
        for (i = 0; i < mentions.length; i++) {
            if (mentions[i].screen_name == screen_name) {
                // post an image
                var img = newest_img(config.img_path);
                tweet_with_media(T, img);
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

// takes: a directory name
// returns: the path of the image within that directory
// that has been most recently modified
function newest_img(dir)
{
    var ftimes, files;
        
    files = fs.readdirSync(dir);
    ftimes = process_dir(dir, files);
    ftimes.sort(function(a, b) {
        return b.time - a.time;
    });
    
    return ftimes[0].path;
}

// takes: a directory, list of files in that directory
// returns: an array of objects with two properties:
// path, time (modified time)
function process_dir(dir, files)
{
    var fpath, ftimes, fobj, stats;
    ftimes = [];
    
    for (var i = 0; i < files.length; i++)
    {
        fpath = path.format({
            dir: dir,
            base: files[i]
        });
        
        if (is_image(fpath))
        {
            stats = fs.statSync(fpath);
            fobj = {
                path: fpath,
                time: new Date(stats.mtime)
            }
            ftimes.push(fobj);            
        }
    }
    return ftimes;
}

// takes: a filename or path
// returns true if valid image, false if not
function is_image(fname)
{
    var ok_exts, ext; 
    ok_exts = ['jpg', 'jpeg', 'png', 'gif'];
    ext = path.extname(fname).toLowerCase().substring(1);
    return ok_exts.indexOf(ext) >= 0;
}


// post a tweet to the authorised user's account
// status will be empty aside from the media file provided
function tweet_with_media(T, file)
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
                    // don't post ALL THE DATA
                    console.log(d.created_at);
                });
            }
            else {
                console.log(e);
            }
        });
    });
}

bot.start();

// module.exports = bot;