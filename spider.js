var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var path = require('path');

var spider = function(site, depth) {
  var self = this;
  this.site = site;
  this.depth = 0;
  this.max_depth = depth;

  this.q = async.queue(function(task, scrape){
    scrape(task);
  })

  this.scrape = function(site) {
    if (site === undefined) {
      var site = {};
      site.url = self.site.url;
      site.depth = self.site.depth;
    }

    if(site.depth !== self.max_depth){
      request(site.url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          self.getLinks(body, site.depth);
        }
      })
    }
  }

  this.getLinks = function(html, depth) {
    var $ = cheerio.load(html);
    var links = $('a');

    async.map(links.map(function(){
      var href = $(this).attr('href');
      if (href && href != self.site){
        if (self.externalUrl(href)){
          self.queueLink(href, depth + 1);
          console.log(depth)
        }
      }
    }))
  }

  this.queueLink = function(href, depth){
    self.q.push({url: href, depth: depth}, self.scrape);
    fs.appendFile('./links.txt', href +"\n", function(err){
      if(err) throw err;
    })
  }

  this.externalUrl = function(href){
    return href.match(/^https?/) !== null;
  }

  // this.internalURL = function(href){
  //   return path.normalize(self.site + '/' + href)
  // }
}

var scraper = new spider({url: 'https://news.ycombinator.com', depth: 0}, 5);
scraper.scrape()