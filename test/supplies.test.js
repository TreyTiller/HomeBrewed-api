"use strict";

var should = require("should");
var app = require("../src/app");
var request = require("supertest")(app);

describe("GET /api/supplies/:recipe_id", function() {
  it("should require authorization", function(done) {
    request
      .post("/api/supplies/:recipe_id")
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it("should respond with a 200", function(done) {
    request
      .get("/api/supplies/1")
      .expect(200, done)
  });
});
