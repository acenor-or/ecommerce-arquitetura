import { IProduct } from './IProduct';

export class DigitalProduct implements IProduct {
  readonly type = 'digital';

  constructor(
    readonly id: number,
    readonly name: string,
    readonly price: number,
  ) {}

  // Download direto, não tem entrega: frete zerado.
  calculateFreight(): number {
    return 0;
  }
}
