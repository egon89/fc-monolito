import request from 'supertest';
import { app } from '../express';
import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import ProductModel from '../../../modules/store-catalog/repository/product.model';
import { ProductRegistrationModel } from '../../../modules/product-adm/repository/product-registration.model';
import { migrator } from '../../../test-migrations/config-migrations/migrator';

describe('E2E test for product', () => {

  let sequelize: Sequelize

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    })
    
    sequelize.addModels([ProductModel, ProductRegistrationModel])
    migration = migrator(sequelize)
    await migration.up()
  })

  afterEach(async () => {
    // if (!migration || !sequelize) {
      // return 
    // }
    //migration = migrator(sequelize)
    //await migration.down()
    await sequelize.close()
  })

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
