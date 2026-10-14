import { IPaymentMethod } from './IPaymentMethod';

// Guarda as formas de pagamento disponíveis, indexadas pelo nome vindo do request.
export class PaymentRegistry {
  private readonly available = new Map<string, IPaymentMethod>();

  register(name: string, method: IPaymentMethod): this {
    this.available.set(name, method);
    return this;
  }

  resolve(name: string): IPaymentMethod | undefined {
    return this.available.get(name);
  }
}
