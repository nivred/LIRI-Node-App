var keys = require("./keys.js")
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require('request');

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
                console.log(tweets[i].created_at);
                console.log("- " + tweets[i].text +"\n");
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
        console.log(queryString);
    }

    spotify.search({ type: 'track', query: queryString, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        for (var i=0; i < data.tracks.items.length; i++) {
            var item = data.tracks.items[i]
            console.log("\nArtist(s): " + item.name);
            console.log("Song Name: " + item.artists[0].name);
            console.log("Preview Song: " + item.artists[0].external_urls.spotify);
            console.log("Album Name: " +item.album.name);            
        }
      console.log(data.tracks.items[0]); 
    });  
}

function movieThis() {
    var queryString = ""
    if (process.argv.length - 3 > 0) {
        for (var i=3; i < process.argv.length; i++) {
            queryString += process.argv[i] + " ";
        }
    } else {
        queryString = "Mr. Nobody"
        console.log(queryString);
    }

    request('https://www.omdbapi.com/?t=' + queryString + '&y=&plot=short&apikey=40e9cece', function (error, response, body) {
        // console.log('body:', body);
        var bodyArr = JSON.parse(body);
        // console.log(bodyArr);
        for (var i=0; i < bodyArr.length; i++) {
            var info = bodyArr[i]
            console.log(info);

            console.log("\nMovie Title: " + bodyArr.Title);
            console.log("Released: " + bodyArr.Released);
            console.log("IMDB Rating: " + info.imdbRating);
            console.log("Rotten Tomatoes Rating: " + info.imdbRating);
            console.log("Country Produced: " + info.Country);
            console.log("Language: " + info.language);
            console.log("Movie Plot: " + info.Plot);
            console.log("Movie Cast: " + info.Actors);
        }
    });
    
}

// function doWhatItSays() {
//     var fs = require(“fs”);
//     fs.readFile()

//     if (err) {
//         return console.log(err);
//     }    
// }

switch(nodeArg) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifyThisSong();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Please select valid command");
    
}