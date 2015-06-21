var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var spider = function() {
  var self = this;

  this.scrape = function() {
    request('https://news.ycombinator.com', function(error, response, body) {
      if (!error && response.statusCode == 200) {
        self.getLinks(body)
      }
    })
  }

  this.getLinks = function(html) {
    var $ = cheerio.load(html);
    var links = $('a');

    async.map(links.map(function(){
      var href = $(this).attr('href');
      console.log(href)
    }))
  }
}

var scraper = new spider();
scraper.scrape()