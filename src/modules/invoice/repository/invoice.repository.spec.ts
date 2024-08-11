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
  const product1Id = 'a1624c89-c18a-4b99-9f7f-8bb0b8dc40c6';
  const product2Id = 'c28002db-4c04-4f97-b762-8f672d9a65e0';
  const invoice = new Invoice({
    id: new Id(uuid),
    name: 'John Doe',
    document: '123456789',
    address: new Address({
      street: 'Main Street',
      number: 123,
      complement: 'Apt 123',
      zip: '12345',
      city: 'New York',
      state: 'NY',
    }),
    items: [
      new InvoiceItem({
        id: new Id(product1Id),
        name: 'Product 1',
        price: 100,
      }),
      new InvoiceItem({
        id: new Id(product2Id),
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
      expect(result.complement).toEqual(invoice.address.complement);
      expect(result.zip).toEqual(invoice.address.zip);
      expect(result.city).toEqual(invoice.address.city);
      expect(result.state).toEqual(invoice.address.state);
      expect(result.items).toHaveLength(2);
      expect(item1.id).toEqual(product1Id);
      expect(item1.name).toEqual(invoice.items[0].name);
      expect(item1.price).toEqual(invoice.items[0].price);
      expect(item2.id).toEqual(product2Id);
      expect(item2.name).toEqual(invoice.items[1].name);
      expect(item2.price).toEqual(invoice.items[1].price);
    });
  });

  describe(InvoiceRepository.prototype.find.name, () => {
    it('should find an invoice by id', async () => {
      const now = new Date();
      await InvoiceModel.create({
        id: uuid,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        zip: invoice.address.zip,
        city: invoice.address.city,
        state: invoice.address.state,
        createdAt: now,
        updatedAt: now,
        items: invoice.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
      },
      {
        include: [InvoiceItemModel],
      }
    );

      const result = await invoiceRepository.find(uuid);

      expect(result.id.id).toEqual(uuid);
      expect(result.name).toEqual(invoice.name);
      expect(result.document).toEqual(invoice.document);
      expect(result.address.street).toEqual(invoice.address.street);
      expect(result.address.number).toEqual(invoice.address.number);
      expect(result.address.complement).toEqual(invoice.address.complement);
      expect(result.address.zip).toEqual(invoice.address.zip);
      expect(result.address.city).toEqual(invoice.address.city);
      expect(result.address.state).toEqual(invoice.address.state);
      expect(result.items).toHaveLength(2);
      expect(result.items[0].id.id).toEqual(product1Id);
      expect(result.items[0].name).toEqual(invoice.items[0].name);
      expect(result.items[0].price).toEqual(invoice.items[0].price);
      expect(result.items[1].id.id).toEqual(product2Id);
      expect(result.items[1].name).toEqual(invoice.items[1].name);
      expect(result.items[1].price).toEqual(invoice.items[1].price);      
    });

    it('should throw an error when invoice is not found', async () => {
      await expect(invoiceRepository.find(uuid)).rejects.toThrow(`Invoice with id ${uuid} not found`);
    
    });
  });
});
