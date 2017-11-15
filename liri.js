var keys = require("./keys.js");
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require('request');

var nodeArg = process.argv[2];
var queryString = ""


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
    if (process.argv.length - 3 > 0) {
        for (var i=3; i < process.argv.length; i++) {
            queryString += process.argv[i] + " ";
        }
    } else {
        queryString = "The Sign Ace of Base"
    }

    spotify.search({ type: 'track', query: queryString, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        for (var i=0; i < data.tracks.items.length; i++) {
            var item = data.tracks.items[i]
            console.log("\nArtist(s): " + item.artists[0].name);
            console.log("Song Name: " + item.name);
            console.log("Preview Song: " + item.artists[0].external_urls.spotify);
            console.log("Album Name: " + item.album.name + "\n");            
        }
    //   console.log(data.tracks.items[0]); 
    });  
}

function movieThis() {
    if (process.argv.length - 3 > 0) {
        for (var i=3; i < process.argv.length; i++) {
            queryString += process.argv[i] + " ";
        }
    } else {
        console.log("\nIf you haven't watched " + "'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
        queryString = "Mr. Nobody";
    }

    request('https://www.omdbapi.com/?t=' + queryString + '&y=&plot=short&apikey=40e9cece', function (error, response, body) {
        
        if (!error && response.statusCode === 200) {
            var movie = JSON.parse(body);
            console.log("\nMovie Title: " + movie.Title);
            console.log("Released: " + movie.Released);
            console.log("IMDB Rating: " + movie.imdbRating);
            console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
            console.log("Country Produced: " + movie.Country);
            console.log("Language: " + movie.Language);
            console.log("Movie Plot: " + movie.Plot);
            console.log("Movie Cast: " + movie.Actors + "\n");
        }
    }); 
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(", ");
        queryString = dataArr[0];
    }); 
    console.log(queryString);
}

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