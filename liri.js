var keys = require("./keys.js")
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var nodeArg = process.argv[2];

var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});

var spotify = new Spotify({
    id: keys.spotifyKeys.client_id,
    secret: keys.spotifyKeys.client_secret
});

function myTweets() {
    var params = {screen_name: 'SystemOfTheNode', count: 20, exclude_replies: true, trim_user: true};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("\n" + tweets[i].text + " at " + tweets[i].created_at + "\n");
            }
        } else {
            console.log(error);
        }
    });
}

function spotifyThisSong() {
    
    var queryString = ""
    if (process.argv.length - 3 > 0) {
        for (var i=3; i < process.argv.length; i++) {
            queryString += process.argv[i] + " ";
        }
    } else {
        queryString = "The Sign"
    }

    spotify.search({ type: 'track', query: queryString, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        
        for (var i=0; i < data.tracks.items.length; i++) {
            var item = data.tracks.items[i]
            console.log("**********************************************************************************")
            console.log("Artist(s): " + item.name);
            console.log("Song Name: " + item.artists[0].name);
            console.log("Preview Song: " + item.artists[0].external_urls.spotify);
            console.log("Album Name: " +item.album.name);
            console.log("**********************************************************************************")
            
        }
    //   console.log(data.tracks.items[0]); 
    });  
}

switch(nodeArg) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifyThisSong();
        break;
    default:
        console.log("Please select valid command");
    
}