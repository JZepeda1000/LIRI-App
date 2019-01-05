var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var dotenv = require("dotenv").config();
var request = require("request");
var fs = require("fs")

var command = process.argv[2];
var liriArgs = process.argv.slice(3).join("+");
startApp (command, liriArgs);
function startApp(command, liriArgs) {

    switch (command) {
        case "my-tweets":
            printCommand();
            tweets();
            break;
        case "spotify-this-song":
            printCommand();
            Spotify(liriArgs);
            break;
        case "movie-this":
            printCommand();
            if (liriArgs === "") {
                liriArgs = "Casablanca";
            movie(liriArgs);
            }
            else {
                movie(liriArgs);
            }
            break;
        case "do-what-it-says":
            printCommand();
            doAsTold();
            break;
        default:
            console.log("Error! \nPleae enter a valid command.")
            break;
    };
}

// Twitter function
function tweets() {
    var clientTW = new Twitter(keys.twitter);
    clientTW.get("statuses/user_timeline", function (error, tweets, response) {
        if (!error) {
            tweets.forEach(tweet => {
                let tweets = [
                    "Username: " + tweet.user.name,
                    "Tweet Time: " + tweet.created_at,
                    "Tweet COntent: " + tweet.text
                ].join("\n");

                console.log(tweets);
                fs.appendFile("log.txt", tweets, function(err) {
                    if(err) throw err;
                })
            })
        }
        else {
            console.log("No Tweets to Display")
        }
    })
}

function spotify(liriArgs) {
    if (liriArgs.length === 0) {
        liriArgs = "Of Crime and Passion";
    }
    const spotify = new Spotify(keys.spotify);
    spotify.search({ type: "track", query: liriArgs, limit: 1}, function (err, data) {

        if (err) {
            return console.log("Error: " + err);
        }
        else {
            let songs = [
                "Artists: " + data.tracks.items[0].album.artists[0].name,
                "Song Title: " + data.tracks.items[0].name,
                "Preview Link: " + data.tracks.items[0].preview_url,
                "Album Title: " + data.tracks.items[0].album.name
            ]
            .join("\n");

            fs.appendFile("log.txt", songs, function (err) {
                if (err) throw err;
            })
            console.log(songs);
        }
    })
}

// OMDB function
function movie(liriArgs) {
    var queryUrl = "http://www.omdbapi.com/?t=" + liriArgs + "&apikey=bff7ad2&t";
    request(queryUrl, function (err, res, data) {
        if (!err && res.statusCode === 200) {
            var obj = JSON.parse(data)

            let movies = [
                "Title: " + obj.Title,
                "Release Year: " + obj.Year,
                "IMDB Rating: " + obj.imdbRating,
                "Rotten Tomatoes rating: " + obj.Ratings[1].Value,
                "Production Location: " + obj.Country,
                "Language: " + obj.Country,
                "Movie Plot: " + obj.Plot,
                "Main Actors: " + obj.Actors
            ]
            .join("\n");
            fs.appendFile("log.txt", movies, function (err) {
                if (err) throw err;
            })
            console.log(movies);
        }
    })
};

function printCommand() {
    fs.appendFile("log.txt", command, function (err) {
        if (err) throw err;
    })
};