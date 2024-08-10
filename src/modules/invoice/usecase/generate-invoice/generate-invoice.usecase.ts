import Id from '../../../@shared/domain/value-object/id.value-object';
import InvoiceItem from '../../domain/invoice-item.entity';
import Invoice from '../../domain/invoice.entity';
import InvoiceGateway from '../../gateway/invoice.gateway';
import Address from '../../value-object/address';
import { GenerateInvoiceInputDto, GenerateInvoiceOutputDto } from './generate-invoice.dto';

export default class GenerateInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway;

  constructor(_invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = _invoiceRepository;
  }

  async execute(input: GenerateInvoiceInputDto): Promise<GenerateInvoiceOutputDto> {
    const props = {
      name: input.name,
      document: input.document,
      address: new Address({
        street: input.street,
        number: Number(input.number),
        complement: input.complement,
        zip: input.zipCode,
        city: input.city,
        state: input.state,
      }),
      items: input.items.map((item) => new InvoiceItem({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      })),
    };

    const invoice = new Invoice(props);
    await this._invoiceRepository.generate(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: String(invoice.address.number),
      complement: invoice.address.complement,
      zipCode: invoice.address.zip,
      city: invoice.address.city,
      state: invoice.address.state,
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: invoice.items.reduce((acc, item) => acc + item.price, 0),
    };
  }
}
