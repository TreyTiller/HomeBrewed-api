const directionsService = {
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
  }
  
  module.exports = directionsService