import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from '../../modules/client-adm/repository/client.model';
import InvoiceItemModel from '../../modules/invoice/repository/invoice-item.model';
import { InvoiceModel } from '../../modules/invoice/repository/invoice.model';
import { ProductRegistrationModel } from '../../modules/product-adm/repository/product-registration.model';
import ProductModel from '../../modules/store-catalog/repository/product.model';
import TransactionModel from '../../modules/payment/repository/transaction.model';

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
  await sequelize.addModels([
    ClientModel,
    InvoiceItemModel,
    InvoiceModel,
    ProductModel,
    ProductRegistrationModel,
    TransactionModel,
  ]);
  await sequelize.sync();
}
setupDb();
