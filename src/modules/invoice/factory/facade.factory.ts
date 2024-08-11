import InvoiceFacade from '../facade/invoice.facade';
import InvoiceRepository from '../repository/invoice.repository';
import CalculateTotalService from '../service/calculate-total/calculate-total.service';
import GenerateInvoiceUseCase from '../usecase/generate-invoice/generate-invoice.usecase';

export default class InvoiceFacadeFactory {
  static create(): InvoiceFacade {
    const invoiceRepository = new InvoiceRepository();
    const calculateTotalService = new CalculateTotalService();
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository, calculateTotalService);
    const findInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository, calculateTotalService);

    return new InvoiceFacade({
      generateInvoiceUseCase,
      findInvoiceUseCase,
    });
  }
}
