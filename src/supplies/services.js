const suppliessService = {
    getAllsupplies(knex) {
      return knex.select('*').from('supplies')
    },
    getById(knex, id) {
      return knex.from('supplies').select('*').where('recipe_id', id)
    },
    insertsupplies(knex, newsupplies) {
      return knex
        .insert(newsupplies)
        .into('supplies')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deletesupplies(knex, id) {
      return knex('supplies')
        .where({ id })
        .delete()
    },
    updatesupplies(knex, id, newsuppliesFields) {
      return knex('supplies')
        .where({ id })
        .update(newsuppliesFields)
    },
  }
  
  module.exports = suppliessService