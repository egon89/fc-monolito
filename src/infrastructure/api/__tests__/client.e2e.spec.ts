import request from 'supertest';
import { app } from '../express';
import { sequelize, setupDb } from '../../db/sqlite';

describe('E2E test for client', () => {

  beforeAll(async () => {
    await setupDb();
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a client', async () => {
    const response = await request(app)
      .post('/clients')
      .send({
        id: '0d583f5f-547e-4816-a4e6-3e6c32727649',
        name: 'John Doe',
        email: 'john_doe@domain.com',
        document: '12345678901',
        address: {
            street: 'Main Street',
            number: '123',
            complement: 'Apartment 101',
            city: 'Big City',
            state: 'BC',
            country: 'Brazil',
            zipCode: '12345-678'
        }
      });

    expect(response.status).toBe(201);
  });
});
