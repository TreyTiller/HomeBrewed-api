const directionsService = {
  getAlldirections(knex) {
    return knex.select('*').from('directions')
  },
  getById(knex, id) {
    return knex.from('directions').select('*').where('recipe_id', id)
  }, 
  insertdirection(knex, newdirection) {
      return knex
        .insert(newdirection)
        .into('directions')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deletedirection(knex, id) {
      return knex('directions')
        .where({ id })
        .delete()
    },
    updatedirections(knex, id, newdirectionsFields) {
      return knex('directions')
        .where({ id })
        .update(newdirectionsFields)
    },
  }
  
  module.exports = directionsService