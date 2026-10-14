import { IProduct } from './IProduct';

export class PhysicalProduct implements IProduct {
  static readonly FREIGHT_FEE = 10;
  readonly type = 'physical';

  constructor(
    readonly id: number,
    readonly name: string,
    readonly price: number,
  ) {}

  // Item físico precisa ser entregue, então tem frete fixo.
  calculateFreight(): number {
    return PhysicalProduct.FREIGHT_FEE;
  }
}
