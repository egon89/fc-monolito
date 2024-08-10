import GenerateInvoiceUseCase from './generate-invoice.usecase';

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  };
};

describe(GenerateInvoiceUseCase.name, () => {
  describe(GenerateInvoiceUseCase.prototype.execute.name, () => {
    it('should generate an invoice', async () => {
      const invoiceRepository = MockRepository();
      const usecase = new GenerateInvoiceUseCase(invoiceRepository);
  
      const input = {
        name: 'John Doe',
        document: '123456789',
        street: '123 Main St',
        number: '456',
        complement: 'Apt 789',
        zipCode: '12345',
        city: 'Metropolis',
        state: 'NY',
        items: [
          { id: '1', name: 'Item 1', price: 100 },
          { id: '2', name: 'Item 2', price: 200 },
        ],
      };
  
      const result = await usecase.execute(input);
  
      expect(invoiceRepository.generate).toHaveBeenCalled();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(input.name);
      expect(result.document).toBe(input.document);
      expect(result.street).toBe(input.street);
      expect(result.number).toBe(input.number);
      expect(result.complement).toBe(input.complement);
      expect(result.zipCode).toBe(input.zipCode);
      expect(result.city).toBe(input.city);
      expect(result.state).toBe(input.state);
      expect(result.items.length).toBe(2);
      expect(result.items[0].id).toBe(input.items[0].id);
      expect(result.items[0].name).toBe(input.items[0].name);
      expect(result.items[0].price).toBe(input.items[0].price);
      expect(result.items[1].id).toBe(input.items[1].id);
      expect(result.items[1].name).toBe(input.items[1].name);
      expect(result.items[1].price).toBe(input.items[1].price);
      expect(result.total).toBe(300);
    });
  });
});
