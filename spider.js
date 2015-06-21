var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var spider = function() {
  var self = this;
  request('https://news.ycombinator.com', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      self.getLinks(body)
    }
  })

  this.getLinks = function(html) {
    var $ = cheerio.load(html);
    var links = $('a');
    console.log(links)
  }
}

spider();