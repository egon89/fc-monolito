import { Sequelize } from 'sequelize-typescript';
import InvoiceFacade from './invoice.facade';
import { InvoiceModel } from '../repository/invoice.model';
import InvoiceItemModel from '../repository/invoice-item.model';
import InvoiceRepository from '../repository/invoice.repository';
import GenerateInvoiceUseCase from '../usecase/generate-invoice/generate-invoice.usecase';
import FindInvoiceUseCase from '../usecase/find-invoice/find-invoice.usecase';
import CalculateTotalService from '../service/calculate-total/calculate-total.service';
import { FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeOutputDto } from './invoice.facade.interface';

describe(InvoiceFacade.name, () => {
  let sequelize: Sequelize;
  let repository: InvoiceRepository;
  let calculateTotalService: CalculateTotalService;
  let generateInvoiceUseCase: GenerateInvoiceUseCase;
  let findInvoiceUseCase: FindInvoiceUseCase;
  let invoiceFacade: InvoiceFacade;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    repository = new InvoiceRepository();
    calculateTotalService = new CalculateTotalService();
    generateInvoiceUseCase = new GenerateInvoiceUseCase(repository, calculateTotalService);
    findInvoiceUseCase = new FindInvoiceUseCase(repository, calculateTotalService);
    invoiceFacade = new InvoiceFacade({
      generateInvoiceUseCase,
      findInvoiceUseCase,
    });

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe(InvoiceFacade.prototype.generate.name, () => {
    it('should generate an invoice', async () => {
      const input = {
        name: 'Invoice 1',
        document: '123456789',
        street: 'Street 1',
        number: '100',
        complement: 'Complement 1',
        zipCode: '12345678',
        city: 'City 1',
        state: 'State 1',
        items: [
          { id: '1', name: 'Item 1', price: 100 },
          { id: '2', name: 'Item 2', price: 200 },
        ],
      };

      const result = await invoiceFacade.generate(input);

      expect(result).toEqual(expect.objectContaining<GenerateInvoiceFacadeOutputDto>({
        id: expect.any(String),
        name: input.name,
        document: input.document,
        street: input.street,
        number: input.number,
        complement: input.complement,
        zipCode: input.zipCode,
        city: input.city,
        state: input.state,
        items: input.items,
        total: 300,
      }));
    });
  });

  describe(InvoiceFacade.prototype.find.name, () => {
    it('should find an invoice', async () => {
      const input = {
        name: 'Invoice 1',
        document: '123456789',
        street: 'Street 1',
        number: '100',
        complement: 'Complement 1',
        zipCode: '12345678',
        city: 'City 1',
        state: 'State 1',
        items: [
          { id: '1', name: 'Item 1', price: 100 },
          { id: '2', name: 'Item 2', price: 200 },
        ],
      };

      const invoice = await invoiceFacade.generate(input);
      const result = await invoiceFacade.find({ id: invoice.id });

      expect(result).toEqual(expect.objectContaining<FindInvoiceFacadeOutputDto>({
        id: invoice.id,
        name: input.name,
        document: input.document,
        address: {
          street: input.street,
          number: input.number,
          complement: input.complement,
          city: input.city,
          state: input.state,
          zipCode: input.zipCode,
        },
        items: input.items,
        total: 300,
        createdAt: expect.any(Date),
      }));
    });
  });
});