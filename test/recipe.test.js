"use strict";

var should = require("should");
var app = require("../src/app");
var request = require("supertest")(app);

describe("GET /api/recipes", function() {
  it("should require authorization", function(done) {
    request
      .get("/api/recipes")
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  var auth = {};
  before(loginUser(auth));

  it("should respond with JSON array", function(done) {
    request
      .get("/api/recipes")
      .set("Authorization", "Bearer " + auth.token)
      .expect(200)
      .expect("Content-Type", /json/)
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
      .post("/api/auth/login")
      .send({
        user_name: "TriggaTrey",
        password: "Trigga001"
      })
      .expect(200)
      .end(onResponse);

    function onResponse(err, res) {
      auth.token = res.body.authToken;
      return done();
    }
  };
}
