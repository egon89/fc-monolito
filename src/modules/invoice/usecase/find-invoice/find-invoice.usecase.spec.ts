import FindInvoiceUseCase from './find-invoice.usecase';
import InvoiceGateway from '../../gateway/invoice.gateway';
import { CalculateTotalServiceInterface } from '../../service/calculate-total/calculate-total.service.interface';
import { FindInvoiceInputDTO, FindInvoiceOutputDTO } from './find-invoice.dto';
import Invoice from '../../domain/invoice.entity';
import Id from '../../../@shared/domain/value-object/id.value-object';
import Address from '../../value-object/address';
import InvoiceItem from '../../domain/invoice-item.entity';

const invoice = new Invoice({
  id: new Id('1'),
  name: 'John Doe',
  document: '123456789',
  address: new Address({
    street: '123 Main St',
    number: 456,
    complement: 'Apt 789',
    city: 'Metropolis',
    state: 'NY',
    zip: '12345',
  }),
  items: [
    new InvoiceItem({ id: new Id('1'), name: 'Item 1', price: 100 }),
    new InvoiceItem({ id: new Id('2'), name: 'Item 2', price: 200 }),
  ],
  createdAt: new Date(),
});

const MockInvoiceRepository = (): InvoiceGateway => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    generate: jest.fn(),
  };
};

const MockCalculateTotalService = (): CalculateTotalServiceInterface => {
  return {
    calculate: jest.fn().mockReturnValue(300),
  };
};

describe(FindInvoiceUseCase.name, () => {
  describe(FindInvoiceUseCase.prototype.execute.name, () => {
    it('should find an invoice and calculate the total', async () => {
      const invoiceRepository = MockInvoiceRepository();
      const calculateTotalService = MockCalculateTotalService();
      const usecase = new FindInvoiceUseCase(invoiceRepository, calculateTotalService);
      const input: FindInvoiceInputDTO = { id: '1' };
  
      const result: FindInvoiceOutputDTO = await usecase.execute(input);
  
      expect(invoiceRepository.find).toHaveBeenCalledWith(input.id);
      expect(calculateTotalService.calculate).toHaveBeenCalledWith(invoice.items);
      expect(result).toEqual({
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        address: {
          street: invoice.address.street,
          number: String(invoice.address.number),
          complement: invoice.address.complement,
          city: invoice.address.city,
          state: invoice.address.state,
          zipCode: invoice.address.zip,
        },
        items: invoice.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
        total: 300,
        createdAt: invoice.createdAt,
      });
    });
  });
});
