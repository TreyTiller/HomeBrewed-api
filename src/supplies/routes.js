const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const { requireAuth } = require('../middleware/jwt-auth')
const suppliesService = require('./services')

const suppliesRouter = express.Router()
const bodyParser = express.json()

const serializesupplies = supplies => ({
  id: supplies.id,
  title: xss(supplies.title),
  recipe_id: supplies.recipe_id
})

suppliesRouter
  .route('/')
  .get((req, res, next) => {
    suppliesService.getAllsupplies(req.app.get('db'))
      .then(supplies => {
        res.json(supplies.map(serializesupplies))
      })
      .catch(next)
  })
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

    const newsupplies = { title, recipe_id }

    suppliesService.insertsupplies(
      req.app.get('db'),
      newsupplies
    )
      .then(supplies => {
        logger.info(`supplies with id ${supplies.id} created.`)
        res
          .status(201)
          .location(`/${supplies.id}`)
          .json(serializesupplies(supplies))
      })
      .catch(next)
  })

suppliesRouter
  .route('/:supplies_id')
  .all((req, res, next) => {
    const { supplies_id } = req.params
    suppliesService.getById(req.app.get('db'), supplies_id)
      .then(supplies => {
        if (!supplies) {
          logger.error(`supplies with id ${supplies_id} not found.`)
          return res.status(404).json({
            error: { message: `supplies Not Found` }
          })
        }
        res.supplies = supplies
        next()
      })
      .catch(next)
  })
  .get((req, res) => {
    res.json(serializesupplies(res.supplies))
  })
  .delete((req, res, next) => {
    const { supplies_id } = req.params
    suppliesService.deletesupplies(
      req.app.get('db'),
      supplies_id
    )
      .then(numRowsAffected => {
        logger.info(`supplies with id ${supplies_id} deleted.`)
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = suppliesRouter
