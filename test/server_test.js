var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var mongoose = require('mongoose');

chai.use(chaiHttp);

process.env.MONGOLAB_URI = 'mongodb://localhost/movies_test';
require(__dirname + '/../server');

describe('the app', function() {
  before(function(done) {
    this.badToken = 'DKW2q97ibz+7xc3b6FfBqo6eMMoYRwNtKILweDVN9C5L';
    chai.request('localhost:3000')
      .post('/api/signup')
      .send({username: 'testuser', password: 'password123'})
      .end(function(err, res) {
        this.token = res.body.token;
        done();
      }.bind(this));
  });
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });
    describe('the movie routes', function() {
      it('should be able to add a movie to the database', function(done) {
        var testMovie = {
          title: 'test',
          token: this.token
        };
        chai.request('localhost:3000')
          .post('/api/movies')
          .send(testMovie)
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.status).to.eql(200);
            expect(res.body).to.have.property('_id');
            expect(res.body.title).to.eql('test');
            done();
          });
      });
      it('should have an error if there is no title', function(done) {
        var testMovie = {
        year: '1986',
        director: 'Bob Smith',
        token: this.token
      };
        chai.request('localhost:3000')
          .post('/api/movies')
          .send(testMovie)
          .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.status).to.eql(200);
          expect(res.text).to.eql('server error');
          done();
        });
      });
      it('should have an error if the year is too high', function(done) {
        var nextYear = new Date().getFullYear() + 1;
        var testMovie = {
          title: 'testmovie',
          year: nextYear,
          director: 'Bob Smith',
          token: this.token
        };
        chai.request('localhost:3000')
        .post('/api/movies')
        .send(testMovie)
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.status).to.eql(200);
          expect(res.text).to.eql('server error');
          done();
        });
      });
      it('should have an error if the year is too low', function(done) {
        var testMovie2 = {
        title: 'testmovie',
        year: '1812',
        director: 'Bob Smith',
        token: this.token
      };
        chai.request('localhost:3000')
        .post('/api/movies')
        .send(testMovie2)
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.status).to.eql(200);
          expect(res.text).to.eql('server error');
          done();
        });
      });
      it('should be able to get all the movies', function(done) {
        chai.request('localhost:3000')
        .get('/api/movies')
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.status).to.eql(200);
          expect(Array.isArray(res.body)).to.eql(true);
          done();
        });
      });
      it('should not be able to add a movie to the database without a token', function(done) {
        var testMovie = {
          title: 'test'
        };
        chai.request('localhost:3000')
          .post('/api/movies')
          .send(testMovie)
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.status).to.eql(401);
            expect(res.text).to.eql('bad login info');
            done();
          });
      });
      it('should not be able to add a movie to the database with an incorrect token', function(done) {
        var testMovie = {
          title: 'test',
          token: this.badToken
        };
        chai.request('localhost:3000')
          .post('/api/movies')
          .send(testMovie)
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.status).to.eql(401);
            expect(res.text).to.eql('bad login info');
            done();
        });
      });
    });
    describe('the auth routes', function() {
      it ('should not allow you to register a username that already exists', function(done) {
        chai.request('localhost:3000')
          .post('/api/signup')
          .send({username: 'testuser', password: 'password123'})
          .end(function(err, res) {
            expect(res.status).to.eql(401);
            expect(res.text).to.eql('username already taken');
            done();
        });
      });
      it ('should not allow you to login with an incorrect password', function(done) {
        chai.request('localhost:3000')
          .get('/api/signin')
          .auth('testuser', 'wrongpassword')
          .end(function(err, res) {
            expect(res.status).to.eql(401);
            expect(res.text).to.eql('bad login info');
            done();
        });
      });
      it ('should not allow you to login with an incorrect username', function(done) {
        chai.request('localhost:3000')
          .get('/api/signin')
          .auth('wronguser', 'wrongpassword')
          .end(function(err, res) {
            expect(res.status).to.eql(401);
            expect(res.text).to.eql('bad login info');
            done();
        });
      });
      it ('should not allow you to login with no basic auth info', function(done) {
        chai.request('localhost:3000')
          .get('/api/signin')
          .end(function(err, res) {
            expect(res.status).to.eql(401);
            expect(res.text).to.eql('nope!');
            done();
        });
      });
      it ('should return a token if login successful', function(done) {
        chai.request('localhost:3000')
          .get('/api/signin')
          .auth('testuser', 'password123')
          .end(function(err, res) {
            expect(res.status).to.eql(200);
            expect(res.body).to.have.property('token');
            done();
        });
      });
    });
});
