import { IProduct, ProductRecord } from './IProduct';
import { PhysicalProduct } from './PhysicalProduct';
import { DigitalProduct } from './DigitalProduct';

type ProductCreator = (record: ProductRecord) => IProduct;

export class ProductFactory {
  // Para suportar um tipo novo basta adicionar uma linha aqui.
  private static readonly creators: Record<string, ProductCreator> = {
    physical: (r) => new PhysicalProduct(r.id, r.name, r.price),
    digital: (r) => new DigitalProduct(r.id, r.name, r.price),
  };

  static createProduct(record: ProductRecord): IProduct {
    const create = ProductFactory.creators[record.type];
    if (!create) {
      throw new Error(`Tipo de produto não reconhecido: ${record.type}`);
    }
    return create(record);
  }
}
