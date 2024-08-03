import Invoice from '../domain/invoice.entity';
import InvoiceGateway from '../gateway/invoice.gateway';

export default class InvoiceRepository implements InvoiceGateway {
  async generate(invoice: Invoice): Promise<void> {
    // TODO: Implement the logic to generate an invoice
  }

  async find(id: string): Promise<Invoice> {
    // TODO: Implement the logic to find an invoice
    throw new Error("Method not implemented.");
  }
} 
