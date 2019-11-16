const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const { requireAuth } = require('../middleware/jwt-auth')
const directionsService = require('./services')

const directionsRouter = express.Router()
const bodyParser = express.json()

const serializedirection = direction => ({
  id: direction.id,
  title: xss(direction.title),
})

directionsRouter
  .route('/')
  .post(bodyParser, (req, res, next) => {
    for (const field of ['title', 'recipe_id']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        })
      }
    }

    const { title, recipe_id } = req.body

    const newdirection = { title, recipe_id }

    directionsService.insertdirection(
      req.app.get('db'),
      newdirection
    )
      .then(direction => {
        logger.info(`direction with id ${direction.id} created.`)
        res
          .status(201)
          .location(`/${direction.id}`)
          .json(serializedirection(direction))
      })
      .catch(next)
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
