var fs = require("fs");
var request = require("request");
var keys = require("./key.js");
var twitter = require("twitter");
var Spotify = require('node-spotify-api');

var twitterKeys = keys.twitterKeys;
var spotifyKeys = keys.spotifyKeys;

var nodeArgs = process.argv;
var action = process.argv[2];
var query = "";

for (var i = 3; i < nodeArgs.length; i++) {
	if (i > 3 && i < nodeArgs.length) {
    	query = query + "+" + nodeArgs[i];
  	} else {
    	query += nodeArgs[i];
  	}
}

function myTweets() {

	var client = new twitter(twitterKeys);
	 
	var params = {screen_name: 'DW_UTclass2017'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	for (i = 0; i < 20; i++) {
	  		console.log("DW_UTclass2017: " + tweets[i].text);
	  		console.log("Tweeted on: " + tweets[i].created_at);
	  	}
	    
	  }
	});

}


function spotifyThisSong() {

	var spotify = new Spotify(spotifyKeys);

	if (query === "") {
		spotify.search({ type: 'track', query: "the sign ace" }, function(err, data) {
			console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
			console.log("Song: " + data.tracks.items[0].name);
        	console.log("Link: " + data.tracks.items[0].external_urls.spotify); 
        	console.log("Album: " + data.tracks.items[0].album.name);
		})
	} else {
		spotify.search({ type: 'track', query: query }, function(err, data) {
			if (err) {
				return console.log("Error occured: " + err);
			}
			console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
			console.log("Song: " + data.tracks.items[0].name);
        	console.log("Link: " + data.tracks.items[0].external_urls.spotify); 
        	console.log("Album: " + data.tracks.items[0].album.name);
		})
	} 

}


function movieThis() {

	var mrNobody = "http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=40e9cece";
	var queryUrl = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=40e9cece";

	request(queryUrl, function(error, response, body) {

		if (query === "") {
			request(mrNobody, function(error, response, body) {
			var movieData = JSON.parse(body);
				console.log("Title: " + movieData.Title);
				console.log("Year: " + movieData.Year);
				console.log("IMDB Rating: " + movieData.imdbRating);
				console.log("Rotten Tomatoes Rating: " + movieData.Ratings[1].Value);
				console.log("Country: " + movieData.Country);
				console.log("Language: " + movieData.Language);
				console.log("Plot: " + movieData.Plot);
				console.log("Actors: " + movieData.Actors);
			})
		} else if (!error && response.statusCode === 200) {
			var movieData = JSON.parse(body);
				console.log("Title: " + movieData.Title);
				console.log("Year: " + movieData.Year);
				console.log("IMDB Rating: " + movieData.imdbRating);
				console.log("Rotten Tomatoes Rating: " + movieData.Ratings[1].Value);
				console.log("Country: " + movieData.Country);
				console.log("Language: " + movieData.Language);
				console.log("Plot: " + movieData.Plot);
				console.log("Actors: " + movieData.Actors);
		}
	});
}


function doWhatItSays() {
	var doWhatISay = "do-what-it-says";

	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		}
		console.log(data);

		var dataArr = data.split(",");

		var doIt = dataArr[1].split();
		var str = doIt.join();
		console.log(doIt);
		console.log(str);

		if (action === doWhatISay) {
			query = str;
			spotifyThisSong(str);
		} 

	});
}


switch (action) {
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
}




