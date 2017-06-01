'use strict';

var semver = require('semver'),
  should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  credentialsEmail,
  user,
  _user,
  admin;

/**
 * User routes tests
 */
describe('User CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials with username
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user credentials with email
    credentialsEmail = {
      usernameOrEmail: 'test@test.com',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    _user = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    };

    user = new User(_user);

    // Save a user to the test db and create new article
    user.save(function (err) {
      should.not.exist(err);
      done();
    });
  });

  it('should be able to register a new user', function (done) {

    _user.username = 'register_new_user';
    _user.email = 'register_new_user_@test.com';

    agent.post('/api/auth/signup')
      .send(_user)
      .expect(200)
      .end(function (signupErr, signupRes) {
        if (signupErr) {
          return done(signupErr);
        }

        signupRes.body.username.should.equal(_user.username);
        signupRes.body.email.should.equal(_user.email);
        signupRes.body.roles.should.be.instanceof(Array).and.have.lengthOf(1);
        signupRes.body.roles.indexOf('user').should.equal(0);
        return done();
      });
  });

  it('should be able to login with username successfully and logout successfully', function (done) {
    // Login with username
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        if (signinErr) {
          return done(signinErr);
        }

        agent.get('/api/auth/signout')
          .expect(302)
          .end(function (signoutErr, signoutRes) {
            if (signoutErr) {
              return done(signoutErr);
            }

            signoutRes.redirect.should.equal(true);

            if (semver.satisfies(process.versions.node, '>=4.0.0')) {
              signoutRes.text.should.equal('Found. Redirecting to /');
            } else {
              signoutRes.text.should.equal('Moved Temporarily. Redirecting to /');
            }

            return done();
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(done);
  });
});
