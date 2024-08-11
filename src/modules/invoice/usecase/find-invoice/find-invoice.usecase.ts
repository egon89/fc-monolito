import UseCaseInterface from '../../../@shared/usecase/use-case.interface';
import InvoiceGateway from '../../gateway/invoice.gateway';
import { CalculateTotalServiceInterface } from '../../service/calculate-total/calculate-total.service.interface';
import { FindInvoiceInputDTO, FindInvoiceOutputDTO } from './find-invoice.dto';

export default class FindInvoiceUseCase implements UseCaseInterface {
  private _invoiceRepository: InvoiceGateway;
  private _calculateTotalService: CalculateTotalServiceInterface;

  constructor(invoiceRepository: InvoiceGateway, calculateTotalService: CalculateTotalServiceInterface) {
    this._invoiceRepository = invoiceRepository;
    this._calculateTotalService = calculateTotalService;
  }

  async execute(input: FindInvoiceInputDTO): Promise<FindInvoiceOutputDTO> {
    const invoice = await this._invoiceRepository.find(input.id);

    return {
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
      total: this._calculateTotalService.calculate(invoice.items),
      createdAt: invoice.createdAt,
    };
  }
}
