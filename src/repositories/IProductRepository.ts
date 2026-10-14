import { ProductRecord } from '../domain/IProduct';

export interface IProductRepository {
  findById(id: number): Promise<ProductRecord | null>;
}
