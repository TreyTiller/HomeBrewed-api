const express = require('express')
const { isWebUri } = require('valid-url')
const xss = require('xss')
const logger = require('../logger')
const RecipesService = require('./services')

const recipesRouter = express.Router()
const bodyParser = express.json()

const serializeRecipe = recipe => ({
  id: recipe.id,
  title: xss(recipe.title),
  url: recipe.url,
  description: xss(recipe.description),
  rating: Number(recipe.rating),
})

recipesRouter
  .route('/')
  .get((req, res, next) => {
    RecipesService.getAllRecipes(req.app.get('db'))
      .then(recipes => {
        res.json(recipes.map(serializeRecipe))
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ['title', 'url', 'rating']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        })
      }
    }

    const { title, url, description, rating } = req.body

    const ratingNum = Number(rating)

    if (!Number.isInteger(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      logger.error(`Invalid rating '${rating}' supplied`)
      return res.status(400).send({
        error: { message: `'rating' must be a number between 0 and 5` }
      })
    }

    if (!isWebUri(url)) {
      logger.error(`Invalid url '${url}' supplied`)
      return res.status(400).send({
        error: { message: `'url' must be a valid URL` }
      })
    }

    const newRecipe = { title, url, description, rating }

    RecipesService.insertRecipe(
      req.app.get('db'),
      newRecipe
    )
      .then(recipe => {
        logger.info(`Recipe with id ${recipe.id} created.`)
        res
          .status(201)
          .location(`/${recipe.id}`)
          .json(serializeRecipe(recipe))
      })
      .catch(next)
  })

recipesRouter
  .route('/:recipe_id')
  .all((req, res, next) => {
    const { recipe_id } = req.params
    RecipesService.getById(req.app.get('db'), recipe_id)
      .then(recipe => {
        if (!recipe) {
          logger.error(`Recipe with id ${recipe_id} not found.`)
          return res.status(404).json({
            error: { message: `Recipe Not Found` }
          })
        }
        res.recipe = recipe
        next()
      })
      .catch(next)
  })
  .get((req, res) => {
    res.json(serializeRecipe(res.recipe))
  })
  .delete((req, res, next) => {
    const { recipe_id } = req.params
    RecipesService.deleteRecipe(
      req.app.get('db'),
      recipe_id
    )
      .then(numRowsAffected => {
        logger.info(`Recipe with id ${recipe_id} deleted.`)
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = recipesRouter
