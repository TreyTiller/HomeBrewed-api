
const app = require('../src/app')

describe('App', () => {
  it('GET /recipes responds with 200 containing array of all recipes', () => {
    return supertest(app)
      .get('/recipes')
      .expect(200, );
  })
})