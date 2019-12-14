const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../src/recipe/routes');

describe('recipes endpoint', () => {
  it('should return all recipes in a list', () => {
    return supertest(recipesRouter)
      .get('/')
      .expect(200);
  });
});