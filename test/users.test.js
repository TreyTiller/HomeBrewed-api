"use strict";

var should = require("should");
var app = require("../src/app");
var request = require("supertest")(app);

function generateRandomString() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
      .toUpperCase()
  );
}

describe("POST /api/users", function() {
  it("should respond with a 201 Created", function(done) {
    console.log(generateRandomString());
    request
      .post("/api/users")
      .send({
        nickname: generateRandomString(),
        user_name: generateRandomString(),
        password: generateRandomString()
      })
      .expect(201, done);
  });
});
