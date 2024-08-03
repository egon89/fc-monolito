import { Sequelize } from 'sequelize-typescript';
import Invoice from '../domain/invoice.entity';
import InvoiceRepository from './invoice.repository';
import { InvoiceModel } from './invoice.model';
import InvoiceItemModel from './invoice-item.model';
import Address from '../value-object/address';
import InvoiceItem from '../domain/invoice-item.entity';
import Id from '../../@shared/domain/value-object/id.value-object';

describe(InvoiceRepository.name, () => {
  let invoiceRepository: InvoiceRepository;
  let sequelize: Sequelize;
  const uuid = '8379a222-c251-4cd6-bf12-47d9737f8775';
  const invoice = new Invoice({
    id: new Id(uuid),
    name: 'John Doe',
    document: '123456789',
    address: new Address({
      street: 'Main Street',
      number: 123,
      zip: '12345',
      city: 'New York',
    }),
    items: [
      new InvoiceItem({
        name: 'Product 1',
        price: 100,
      }),
      new InvoiceItem({
        name: 'Product 2',
        price: 200,
      }),
    ],
  });

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
    invoiceRepository = new InvoiceRepository();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe(InvoiceRepository.prototype.generate.name, () => {
    it('should generate an invoice', async () => {
      await invoiceRepository.generate(invoice);

      const result = await InvoiceModel.findOne({
        where: { id: uuid },
        include: [InvoiceItemModel],
      });
      const [item1, item2] = result.items;

      expect(result.id).toEqual(invoice.id.id);
      expect(result.name).toEqual(invoice.name);
      expect(result.document).toEqual(invoice.document);
      expect(result.street).toEqual(invoice.address.street);
      expect(result.number).toEqual(invoice.address.number);
      expect(result.zip).toEqual(invoice.address.zip);
      expect(result.city).toEqual(invoice.address.city);
      expect(result.items).toHaveLength(2);
      expect(item1.name).toEqual(invoice.items[0].name);
      expect(item1.price).toEqual(invoice.items[0].price);
      expect(item2.name).toEqual(invoice.items[1].name);
      expect(item2.price).toEqual(invoice.items[1].price);
    });
  });

  describe(InvoiceRepository.prototype.find.name, () => {
    it('should find an invoice by id', async () => {
      await InvoiceModel.create({
        id: uuid,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        zip: invoice.address.zip,
        city: invoice.address.city,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: invoice.items.map((item) => ({
          name: item.name,
          price: item.price,
        })),
      });

      const result = await invoiceRepository.find(uuid);

      expect(result).toEqual(invoice);
    });
  });
});