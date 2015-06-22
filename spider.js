var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');

var spider = function() {
  var self = this;
  this.queue = [];

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
      self.queue.push(href)
      fs.appendFile('./links.txt', href +"\n", function(err){
        if(err) throw err;
      })
    }))
  }
}

var scraper = new spider();
scraper.scrape()