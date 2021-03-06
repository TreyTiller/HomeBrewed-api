require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const recipeRoutes = require("./recipe/routes");
const RecipeService = require("./recipes-service");
const authRouter = require("./auth/auth-router");
const directionsRouter = require("./directions/routes");
const suppliesRouter = require("./supplies/routes");
const usersRouter = require("./users/routes");
const knex = require("knex");
const { DATABASE_URL } = require("./config");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

const db = knex({
  client: "pg",
  connection: DATABASE_URL
});

app.set("db", db);

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/recipes", recipeRoutes);
app.use("/api/directions", directionsRouter);
app.use("/api/supplies", suppliesRouter);
app.use("/api/users", usersRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
