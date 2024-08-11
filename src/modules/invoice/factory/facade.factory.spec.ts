import InvoiceFacadeFactory from '../factory/facade.factory';
import InvoiceFacade from '../facade/invoice.facade';

describe(InvoiceFacadeFactory.name, () => {
  describe(InvoiceFacadeFactory.create.name, () => {
    it('should create an instance of InvoiceFacade', () => {
      const invoiceFacade = InvoiceFacadeFactory.create();

      expect(invoiceFacade).toBeInstanceOf(InvoiceFacade);
    });
  });
});
