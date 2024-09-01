import request from 'supertest';
import { app } from '../express';
import { sequelize, setupDb } from '../../db/sqlite';
import { ClientModel } from '../../../modules/client-adm/repository/client.model';
import ProductModel from '../../../modules/store-catalog/repository/product.model';

describe('E2E test for checkout', () => {
  beforeAll(async () => {
    await setupDb();
    await sequelize.sync({ force: true });
  });

  it('should checkout an order', async () => {
    const client = await ClientModel.create({
      id: '0d583f5f-547e-4816-a4e6-3e6c32727649',
      name: 'John Doe',
      email: 'john_doe@domain.com',
      document: '12345678901',
      street: 'Main Street',
      number: '123',
      complement: 'Apartment 101',
      city: 'Big City',
      state: 'BC',
      zipcode: '12345-678',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductModel.create({
      id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
      name: 'Product 1',
      description: 'Description for Product 1',
      purchasePrice: 100,
      salesPrice: 130,
      stock: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductModel.create({
      id: 'a7d21b95-ad83-4184-bcc4-a5dd9c51f87b',
      name: 'Product 2',
      description: 'Description for Product 2',
      purchasePrice: 200,
      salesPrice: 230,
      stock: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .post('/checkout')
      .send({
        clientId: client.id,
        products: [
          { productId: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p' },
          { productId: 'a7d21b95-ad83-4184-bcc4-a5dd9c51f87b' },
        ],
      });

    expect(response.status).toBe(201);
  });
});
