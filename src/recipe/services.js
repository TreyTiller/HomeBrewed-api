const RecipesService = {
    getAllRecipes(knex, user_id) {
      return knex.select('*').from('recipes').where({user_id}).orWhere({user_id: null}).orderBy("id", "desc")
    },
    getById(knex, id) {
      return knex.from('recipes').select('*').where('id', id).first()
    },
    insertRecipe(knex, newRecipe) {
      return knex
        .insert(newRecipe)
        .into('recipes')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deleteRecipe(knex, user_id) {
      return knex('recipes')
        .where({ user_id })
        .delete()
    },
    updateRecipe(knex, id, user_id, newRecipeFields) {
      return knex('recipes')
        .where({ id, user_id })
        .update(newRecipeFields)
    },
  }
  
  module.exports = RecipesService