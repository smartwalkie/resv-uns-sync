const { TwitterApi } = require("twitter-api-v2");
const { twitter } = require('../config');

const _UDsalesbotConfig = {
    appKey: twitter.TWITTER_API_KEY,
    appSecret: twitter.TWITTER_APP_KEY_SECRET,
    accessToken: twitter.TWITTER_ACCESS_TOKEN,
    accessSecret: twitter.TWITTER_ACCESS_TOKEN_SECRET
}

const _UDclubsalesbot = new TwitterApi(_UDsalesbotConfig);

async function postTweet(tweet) {
    await _UDclubsalesbot.v2.tweet(tweet).then(res => {
        console.log(`[postTweet] Tweeted: ${res.data.text}`)
    })
        .catch(err => {
            console.log("[postTweet] Error Tweet: ");
            console.log(err.dataq);
        });
}

module.exports = { postTweet }