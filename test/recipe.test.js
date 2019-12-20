'use strict';

var should = require('should');
var app = require('../src/app');
var request = require('supertest')(app);

describe('GET /api/recipes', function() {

    it('should require authorization', function(done) {
        request
            .get('/api/recipes')
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    var auth = {};
    before(loginUser(auth));

    it('should respond with JSON array', function(done) {
        request
            .get('/api/recipes')
            .set('Authorization', 'Bearer ' + auth.token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                done();
            });
    });

});

function loginUser(auth) {
    return function(done) {
        request
            .post('/api/auth/login')
            .send({
                user_name: 'DEMO',
                password: 'Demo001!'
            })
            .expect(200)
            .end(onResponse);

        function onResponse(err, res) {
            auth.token = res.body.token;
            return done();
        }
    };
}



// var expect = require('chai').expect;
// var app = require('../src/app');
// var request = require('supertest');


// //let's set up the data we need to pass to the login method
// const userCredentials = {
//     user_name: 'DEMO', 
//     password: 'Demo001!'
//   }
//   //now let's login the user before we run any tests
//   var authenticatedUser = request.agent(app);
//   before(function(done){
//     authenticatedUser
//       .post('/login')
//       .send(userCredentials)
//       .end(function(err, response){
//         expect(response.statusCode).to.equal(200);
//         expect('Location', '/');
//         done();
//       });
//   });

//   describe('GET /api/recipes', function() {
//     it('should respond with JSON array', function(done) {
//                 request
//                     authenticatedUser.get('/api/recipes')
//                     .set('Authorization', 'bearer ' + auth.token)
//                     .expect(200)
//                     .expect('Content-Type', /json/)
//                     .end(function(err, res) {
//                         if (err) return done(err);
//                         res.body.should.be.instanceof(Array);
//                         done();
//                     });
//             });
        
//         });
//   //this test says: make a POST to the /login route with the email: sponge@bob.com, password: garyTheSnail
//   //after the POST has completed, make sure the status code is 200 
//   //also make sure that the user has been directed to the /home page