
// We need request and fs modules
var request = require('request');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

// Needed to connect to the API
var GITHUB_USER = "cgarate";
var GITHUB_TOKEN = "a39fe022b7ae6391b7869a740e672aaae22c62d5"

// The main function. Creates a request to the github API to get a list of contributors' info of a specific repository.
var getRepoContributors = function (repoOwner, repoName, cb) {

  // We need to set a custom User-Agent so we pass the options object to the request function.
  var options = {
    //url: 'https://api.github.com/repos/request/request',
    url: `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request'
    }
  };

  // Connect to the API
  request(options, function(err, response, body) {
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
         console.log("Downloaded: " + filePath);
       })
}

// The call to the main function including the callback function.
getRepoContributors("jquery", "jquery", function(err, result) {
  //console.log(result);
  for (user in result) {
    filePath = "avatars/" + result[user].login + ".png" ;
    downloadImageByURL(result[user].avatar_url, filePath);
    //console.log(result[user].avatar_url, filePath);
  }
});

