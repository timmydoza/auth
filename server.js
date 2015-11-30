var mongoose = require('mongoose');
var express = require('express');
var moviesRouter = require(__dirname + '/routes/movies_routes');
var authRouter = require(__dirname + '/routes/auth_routes')
var app = express();
process.env.APPSECRET = process.env.APPSECRET || 'thisisnotasecret';

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/movie_dev');

app.use('/api', moviesRouter);
app.use('/api', authRouter);

app.listen(process.env.PORT || 3000, function() {
  console.log('server running on port 3000');
});
