var request = require('request');
request('https://news.ycombinator.com', function(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body)
  }
})