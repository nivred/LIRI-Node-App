// variables for all requires
var keys = require("./keys.js");
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require('request');
// variables for arguments and user input
var nodeArg = process.argv[2];
var queryString = "";
var argLen = process.argv.length - 3;
// variable for twitter keys and tokens
var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});

// varialble for spotify keys
var spotify = new Spotify({
    id: keys.spotifyKeys.client_id,
    secret: keys.spotifyKeys.client_secret
});

// begin tweet function
function myTweets() {
    // access twitter account and set parameters
    var params = {screen_name: 'SystemOfTheNode', count: 20, exclude_replies: true, trim_user: true};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        // if no error beging cycling through posted tweets
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

// begin spotify function
function spotifyThisSong(song) {
   console.log(song); 
    if (song == "I Want it That Way") {
        console.log("hi");
    }
    // if user input is more than one word long cycle through and concatinate string
    if (argLen > 0) {
        for (var i=3; i < process.argv.length; i++) {
            queryString += process.argv[i] + " ";
        }
        // set default song selection and info if not indicated
    } else {
        queryString = "The Sign Ace of Base"
    }
    // set up spotify npm parameters with error catching
    spotify.search({ type: 'track', query: queryString, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        // loop through data object
        for (var i=0; i < data.tracks.items.length; i++) {
            // shorten object path to variable
            var item = data.tracks.items[i]
            // display output
            console.log("\nArtist(s): " + item.artists[0].name);
            console.log("Song Name: " + item.name);
            console.log("Preview Song: " + item.artists[0].external_urls.spotify);
            console.log("Album Name: " + item.album.name + "\n");            
        }
        // console.log(data.tracks.items[0]); 
    });  
}

// begin OMDB function
function movieThis() {
    // if user input is more than one word long cycle through and concatinate string
    if (process.argv.length - 3 > 0) {
        for (var i=3; i < process.argv.length; i++) {
            queryString += process.argv[i] + " ";
        }
        // set default response and information if not indicated
    } else {
        console.log("\nIf you haven't watched " + "'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
        queryString = "Mr. Nobody";
    }
    // set up OMDB parameters with error catching
    request('https://www.omdbapi.com/?t=' + queryString + '&y=&plot=short&apikey=40e9cece', function (error, response, body) {
        // if no error convert data and display select results
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

// begin random function
function doWhatItSays() {
    // read file and error catch
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        // change argument length to pass new data
        argLen = 1
        var dataArr = data.split(",");
        nodeArg = dataArr[0];
        queryString = dataArr[1];
        console.log(nodeArg);
        console.log(queryString);
        spotifyThisSong(queryString);
    }); 
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
        console.log("blah");
        doWhatItSays();
        break;
    default:
        console.log("Please select valid command");
}