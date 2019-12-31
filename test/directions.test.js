"use strict";

const knex = require("knex");
var should = require("should");
var app = require("../src/app");
var request = require("supertest");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

describe("GET /api/directions/:recipe_id", function() {
  it("should require authorization", function(done) {
    request(app)
      .post("/api/directions/1")
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it("should respond with a 200 ", function(done) {
    request(app)
      .get("/api/directions/1")
      .expect(200, done);
  });
});
