var expect = require('chai').expect;
var app = require('../src/app');
var request = require('supertest');

//let's set up the data we need to pass to the login method
const userCredentials = {
    user_name: 'DEMO', 
    password: 'Demo001!'
  }
  //now let's login the user before we run any tests
  var authenticatedUser = request.agent(app);
  before(function(done){
    authenticatedUser
      .post('/api/auth/login')
      .send(userCredentials)
      .end(function(err, response){
        expect(response.statusCode).to.equal(200);
        expect('Location', '/');
        done();
      });
  });

  describe('GET /api/recipes', function(done){
      it('should return a 200 response if the user is logged in', function(done){
        authenticatedUser.get('/api/recipes/')
        .expect(200, done);
      });

      it('should return a 400 response', function(done){
        request(app).get('/api/recipes/')
        .expect(400, done);
      });
    });