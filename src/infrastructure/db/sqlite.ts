import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from '../../modules/client-adm/repository/client.model';
import InvoiceItemModel from '../../modules/invoice/repository/invoice-item.model';
import { InvoiceModel } from '../../modules/invoice/repository/invoice.model';
import { ProductRegistrationModel } from '../../modules/product-adm/repository/product-registration.model';
import ProductModel from '../../modules/store-catalog/repository/product.model';
import TransactionModel from '../../modules/payment/repository/transaction.model';
import OrderItemModel from '../../modules/checkout/repository/order-item.model';
import OrderModel from '../../modules/checkout/repository/order.model';

export let sequelize: Sequelize;

export async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
  sequelize.addModels([
    ClientModel,
    InvoiceItemModel,
    InvoiceModel,
    OrderItemModel,
    OrderModel,
    ProductModel,
    ProductRegistrationModel,
    TransactionModel,
  ]);
  await sequelize.sync();
  console.log('Database is ready');
}
