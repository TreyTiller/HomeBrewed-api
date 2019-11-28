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
  .route('/:recipe_id')
  .get((req, res, next) => {
    suppliesService.getById(req.app.get('db'), req.params.recipe_id)
      .then(supplies => {
        res.json(supplies.map(serializesupplies))
      })
      .catch(next)
  })
  .post(requireAuth, bodyParser, (req, res, next) => {
    req.body.forEach(item => {
      for (const field of ['title']) {
        if (!item[field]) {
          logger.error(`${field} is required`)
          return res.status(400).send({
            error: { message: `'${field}' is required` }
          })
        }
      }

      const { title } = item

      const newsupplies = { title, recipe_id: req.params.recipe_id }

      suppliesService.insertsupplies(
        req.app.get('db'),
        newsupplies
      )
        .then(supplies => {
          logger.info(`supplies with id ${supplies.id} created.`)

        })
        .catch(next)
    })
    res
      .status(201)
      .send()
  })

suppliesRouter
  .route('/:recipe_id')
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
      req.params.recipe_id,
      supplies_id
    )
      .then(numRowsAffected => {
        logger.info(`supplies with id ${supplies_id} deleted.`)
        res.status(204).end()
      })
      .catch(next)
  })



module.exports = suppliesRouter
