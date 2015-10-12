var promise = require('promise');
var express = require('express');
var process = require('child_process');
var dirTree = require('directory-tree');
var app = express();

app.get('/test', function(req, res) {
  var url1 = req.query.url1;
  var url2 = req.query.url2;
  var depth = 1;
  var output = 'tmp';

  res.set('Access-Control-Allow-Origin', '*');

  var purl = promise.denodeify(process.exec);
  var p1 = purl("wget -r -l" + depth + " -P" + output + " " + url1)

  var p2 = p1.then(function(data) {
    return purl("wget -r -l" + depth + " -P" + output + " " + url2);
  }, function(err) {
    res.status(500).end();
  });

  p2.then(function(data) {
    var tree = dirTree.directoryTree('tmp');
    res.send(tree.children);
    res.status(200).end();
  }, function(err) {
    res.status(500).end();
  });

});

app.listen(3000);
console.log("Listen to 3000");