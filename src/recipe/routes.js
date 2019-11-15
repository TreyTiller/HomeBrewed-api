const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const RecipesService = require('./services')

const recipesRouter = express.Router()
const bodyParser = express.json()

const serializeRecipe = recipe => ({
  id: recipe.id,
  title: xss(recipe.title),
  skill: xss(recipe.skill),
  time: xss(recipe.time),
  description: xss(recipe.description),
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
    for (const field of ['title', 'skill', 'time', 'description']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        })
      }
    }

    const { title, skill, time, description } = req.body

    const newRecipe = { title, skill, time, description }

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
