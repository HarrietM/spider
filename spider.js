var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var path = require('path');

var spider = function(site, depth) {
  var self = this;
  this.site = site;
  this.depth = depth;

  this.q = async.queue(function(task, scrape){
    scrape(task)
  })

  this.scrape = function(site) {
    if (site === undefined) {
      site = self.site;
    }

    request(site, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        self.getLinks(body)
        console.log(self.q)
      }
    })
  }

  this.getLinks = function(html) {
    var $ = cheerio.load(html);
    var links = $('a');

    async.map(links.map(function(){
      var href = $(this).attr('href');
      if (href && href != self.site){
        if (self.externalUrl(href)){
          self.queueLink(href)
        } else {
          self.queueLink(self.internalURL(href))
        }
      }
    }))
  }

  this.queueLink = function(href){
    self.q.push(href, self.scrape)
    fs.appendFile('./links.txt', href +"\n", function(err){
      if(err) throw err;
    })
  }

  this.externalUrl = function(href){
    return href.match(/^https?/) !== null;
  }

  this.internalURL = function(href){
    return path.normalize(self.site + '/' + href)
  }
}

var scraper = new spider('https://news.ycombinator.com', 5);
scraper.scrape()