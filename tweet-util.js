const fs = require('fs');
const path = require('path');

// takes: a directory name
// returns: the path of the image within that directory
// that has been most recently modified
exports.newest_img = (dir) =>
{
    var ftimes, files;
        
    files = fs.readdirSync(dir);
    ftimes = this.process_dir(dir, files);
    ftimes.sort(function(a, b) {
        return b.time - a.time;
    });
    
    return ftimes[0].path;
}

// takes: a directory, list of files in that directory
// returns: an array of objects with two properties:
// path, time (modified time)
exports.process_dir = (dir, files) =>
{
    var fpath, ftimes, fobj, stats;
    ftimes = [];
    
    for (var i = 0; i < files.length; i++)
    {
        fpath = path.format({
            dir: dir,
            base: files[i]
        });
        
        if (this.is_image(fpath))
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
exports.is_image = (fname) =>
{
    var ok_exts, ext; 
    ok_exts = ['jpg', 'jpeg', 'png', 'gif'];
    ext = path.extname(fname).toLowerCase().substring(1);
    return ok_exts.indexOf(ext) >= 0;
}


// post a tweet to the authorised user's account
// status will be empty aside from the media file provided
exports.tweet_with_media = (T, file) =>
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
