
// We need request and fs modules
var request = require('request');
var fs = require('fs');
require('dotenv/config');

console.log('Welcome to the GitHub Avatar Downloader!');

// Needed to connect to the API
var GITHUB_USER = process.env.GITHUB_USER;
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;

var args = process.argv;
var argRepoOwner = args[2];
var argRepoName = args[3];

// The main function. Creates a request to the github API to get a list of contributors' info of a specific repository.
var getRepoContributors = function (repoOwner, repoName, cb) {

  // We need to set a custom User-Agent so we pass the options object to the request function.
  var options = {
    url: `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request'
    }
  };

  // Connect to the API
  request(options, function(err, response, body) {
    console.log(response.statusCode);
    if (err) throw err;
    if (response.statusCode == 200) {

      // Convert the JSON object received to a JS object.
      var contributors = JSON.parse(body);

      // Pass it to the callback function.
      cb(err, contributors);
    }

  });
}

// Receives the URL we got from the API, establishes a request to the URL
function downloadImageByURL(url, filePath) {

  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .pipe(fs.createWriteStream(filePath))
       .on('finish', function () {
         console.log(filePath + " downloaded.");
       })
}


// Make the arguments required!
if (argRepoOwner === undefined || argRepoName === undefined) {

  console.log("Sacrilege, arguments are incomplete!");

  } else {
    getRepoContributors(argRepoOwner, argRepoName, function(err, result) {

      for (user in result) {
        filePath = "avatars/" + result[user].login + ".png" ;
        downloadImageByURL(result[user].avatar_url, filePath);

      }
    });
}


