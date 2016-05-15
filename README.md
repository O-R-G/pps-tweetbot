O\_R\_G\_pps Tweetbot
=========================

This Node.js application tweets out images in response to @ replies.
------------

Documentation
------------
 - https://dev.twitter.com/streaming/userstreams
 - https://github.com/ttezel/twit#twit
 - https://t.co/TweetObject

Before running
------------
 1. Copy the config.sample.js to a file named config.js in the same directory
 2. Create an app at [t.co/apps](https://t.co/apps) to get consumer keys and generate access keys.
 3. Add these keys to your newly created config.js file.

Note: For your safety, the config.js file will NOT be added to your repository.  This is handled by the .gitignore file and the purpose is to not publically expose your applications keys.

Install twit
------------
	npm install

To run
-----------
    grunt forever:bot:start

Based on [Twitter REST and Streaming Examples](https://github.com/jbulava/twitter-api-examples) by [@jbulava](https://twitter.com/jbulava)
