import request from 'supertest';
import { app } from '../express';
import { sequelize, setupDb } from '../../db/sqlite';
import { InvoiceModel } from '../../../modules/invoice/repository/invoice.model';
import InvoiceItemModel from '../../../modules/invoice/repository/invoice-item.model';
import { FindInvoiceFacadeOutputDto } from '../../../modules/invoice/facade/invoice.facade.interface';

describe('E2E test for invoice route', () => {
  beforeAll(async () => {
    await setupDb();
    await sequelize.sync({ force: true });
  });

  it('should retrieve an invoice by id', async () => {
    const now = new Date('2024-09-01T00:00:00Z');
    const invoice = await InvoiceModel.create({
      id: '12345',
      name: 'John Doe',
      document: '12345678901',
      street: 'Main Street',
      number: 123,
      complement: 'Apartment 101',
      zip: '12345-678',
      city: 'Big City',
      state: 'BC',
      createdAt: now,
      updatedAt: now,
    });

    await InvoiceItemModel.create({
      id: 'item1',
      name: 'Product 1',
      price: 100,
      invoiceId: invoice.id,
    });

    await InvoiceItemModel.create({
      id: 'item2',
      name: 'Product 2',
      price: 200,
      invoiceId: invoice.id,
    });

    const expected: FindInvoiceFacadeOutputDto = {
        id: '12345',
        name: 'John Doe',
        document: '12345678901',
        address: {
          street: 'Main Street',
          number: '123',
          complement: 'Apartment 101',
          city: 'Big City',
          state: 'BC',
          zipCode: '12345-678',
        },
        items: [
          { id: 'item1', name: 'Product 1', price: 100 },
          { id: 'item2', name: 'Product 2', price: 200 },
        ],
        total: 300,
        createdAt: expect.any(String),
    };

    const { status, body } = await request(app)
      .get(`/invoices/${invoice.id}`)
      .send();

    expect(status).toBe(200);
    expect(body).toEqual(expected);
  });
});
