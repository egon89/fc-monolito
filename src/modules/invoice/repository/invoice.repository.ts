import Id from '../../@shared/domain/value-object/id.value-object';
import InvoiceItem from '../domain/invoice-item.entity';
import Invoice from '../domain/invoice.entity';
import InvoiceGateway from '../gateway/invoice.gateway';
import Address from '../value-object/address';
import InvoiceItemModel from './invoice-item.model';
import { InvoiceModel } from './invoice.model';

export default class InvoiceRepository implements InvoiceGateway {
  async generate(invoice: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      zip: invoice.address.zip,
      city: invoice.address.city,
      state: invoice.address.state,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: invoice.items.map((item) => new InvoiceItemModel({
        id: item.id.id,
        name: item.name,
        price: item.price,
        invoiceId: invoice.id.id,
      })),
    },
    {
      include: [InvoiceItemModel],
    });
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: [InvoiceItemModel],
    });

    if (!invoice) {
      throw new Error(`Invoice with id ${id} not found`);
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address({
        street: invoice.street,
        number: invoice.number,
        complement: invoice.complement,
        zip: invoice.zip,
        city: invoice.city,
        state: invoice.state,
      }),
      items: invoice.items.map((item) => new InvoiceItem({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      })),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }
} 
