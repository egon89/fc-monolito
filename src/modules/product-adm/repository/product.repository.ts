import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import { ProductRegistrationModel } from "./product-registration.model";

export default class ProductRepository implements ProductGateway {
  async add(product: Product): Promise<void> {
    console.log('ProductRepository.add', product); // TODO: remove
    try {
      await ProductRegistrationModel.create({
        id: product.id.id,
        name: product.name,
        description: product.description,
        purchasePrice: product.purchasePrice,
        stock: product.stock,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.log('ProductRepository.add', error); // TODO: remove
      throw new Error('Error adding product');
    }
  }
  async find(id: string): Promise<Product> {
    const product = await ProductRegistrationModel.findOne({
      where: { id },
    });

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }
}
