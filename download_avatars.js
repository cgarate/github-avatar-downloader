
// We need request and fs modules
var request = require('request');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

// Needed to connect to the API
var GITHUB_USER = "cgarate";

var args = process.argv;
var argRepoOwner = args[2];
var argRepoName = args[3];
var argToken = args[4];

// The main function. Creates a request to the github API to get a list of contributors' info of a specific repository.
var getRepoContributors = function (repoOwner, repoName, cb, APItoken) {

  // We need to set a custom User-Agent so we pass the options object to the request function.
  var options = {
    //url: 'https://api.github.com/repos/request/request',
    url: `https://${GITHUB_USER}:${APItoken}@api.github.com/repos/${repoOwner}/${repoName}/contributors`,
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



if (argRepoOwner === undefined || argRepoName === undefined) {

  console.log("Sacrilege, arguments are incomplete!");

  } else {
    getRepoContributors(argRepoOwner, argRepoName, function(err, result) {

      for (user in result) {
        filePath = "avatars/" + result[user].login + ".png" ;
        downloadImageByURL(result[user].avatar_url, filePath);

      }
    }, argToken);
}


