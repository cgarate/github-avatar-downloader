
var request = require('request');

console.log('Welcome to the GitHub Avatar Downloader!');

var GITHUB_USER = "cgarate";
var GITHUB_TOKEN = "a39fe022b7ae6391b7869a740e672aaae22c62d5"

getRepoContributors = function (repoOwner, repoName, cb) {
  //var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var options = {
    //url: 'https://api.github.com/repos/request/request',
    url: `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request'
    }
  };

  request(options, function(err, response, body) {
    if (err) throw err;
    if (response.statusCode == 200) {
      //console.log(cb(err, body));
      contributors = JSON.parse(body);
      cb(err, contributors);
    }

  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log(contributors);
});

// module.exports = {
//   getContributors: getContributors

// }