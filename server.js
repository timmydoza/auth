var mongoose = require('mongoose');
var express = require('express');
var moviesRouter = require(__dirname + '/routes/movies_routes.js');
var app = express();

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/movie_dev');

app.use('/api', moviesRouter);

app.listen(process.env.PORT || 3000, function() {
  console.log('server running on port 3000');
});
