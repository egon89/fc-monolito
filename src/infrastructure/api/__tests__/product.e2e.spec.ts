import request from 'supertest';
import { app } from '../express';
import { sequelize, setupDb } from '../../db/sqlite';

describe('E2E test for product', () => {

  beforeAll(async () => {
    await setupDb();
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should add a product', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        name: 'Product 1',
        description: 'Description for Product 1',
        purchasePrice: 100,
        stock: 50,
      });

    expect(response.status).toBe(201);
  });
});
