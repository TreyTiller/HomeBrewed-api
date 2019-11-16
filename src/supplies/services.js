const suppliessService = {
    getAllsuppliess(knex) {
      return knex.select('*').from('suppliess')
    },
    getById(knex, id) {
      return knex.from('suppliess').select('*').where('id', id).first()
    },
    insertsupplies(knex, newsupplies) {
      return knex
        .insert(newsupplies)
        .into('suppliess')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deletesupplies(knex, id) {
      return knex('suppliess')
        .where({ id })
        .delete()
    },
    updatesupplies(knex, id, newsuppliesFields) {
      return knex('suppliess')
        .where({ id })
        .update(newsuppliesFields)
    },
  }
  
  module.exports = suppliessService