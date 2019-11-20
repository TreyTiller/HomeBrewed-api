const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const { requireAuth } = require('../middleware/jwt-auth')
const directionsService = require('./services')

const directionsRouter = express.Router()
const bodyParser = express.json()

const serializedirections = directions => ({
  id: directions.id,
  title: xss(directions.title),
  recipe_id: directions.recipe_id
})

directionsRouter
  .route('/:recipe_id')
  .get((req, res, next) => {
    directionsService.getById(req.app.get('db'), req.params.recipe_id)
      .then(directions => {
        res.json(directions.map(serializedirections))
      })
      .catch(next)
  })
  .post(requireAuth, bodyParser, (req, res, next) => {
    req.body.forEach(item => {
      for (const field of ['title']) {
        if (!item[field]) {
          logger.error(`${field} is required`)
          return
        }
      }

      const { title } = item

      const newdirection = { title, recipe_id: req.params.recipe_id }

      directionsService.insertdirection(
        req.app.get('db'),
        newdirection
      )
        .then(direction => {
          logger.info(`direction with id ${direction.id} created.`)

        })
        .catch(next)
    })
    res
      .status(201)
      .send()
  })


directionsRouter
  .route('/:direction_id')
  .delete((req, res, next) => {
    const { direction_id } = req.params
    directionsService.deletedirection(
      req.app.get('db'),
      direction_id
    )
      .then(numRowsAffected => {
        logger.info(`direction with id ${direction_id} deleted.`)
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = directionsRouter
