var express = require('express');
var moviesRouter = express.Router();
var bodyParser = require('body-parser');
var Movie = require(__dirname + '/../models/movie');

var handleError = function(err, res) {
  res.send('server error');
};

moviesRouter.get('/movies', function(req, res) {
  Movie.find({}, function(err, data) {
    if (err) return handleError(err, res);
    res.json(data);
  });
});

moviesRouter.post('/movies', bodyParser.json(), function(req, res) {
  var newMovie = new Movie(req.body);
  newMovie.save(function(err, data) {
    if (err) return handleError(err, res);
    res.json(data);
  });
});

module.exports = moviesRouter;
