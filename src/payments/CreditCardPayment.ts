import logger from '../lib/logger';
import { IPaymentMethod, PaymentDetails } from './IPaymentMethod';

export class CreditCardPayment implements IPaymentMethod {
  async process(details: PaymentDetails): Promise<void> {
    logger.info(`Processando cartão final ${details.cardNumber.slice(-4)}`);
    // Simula a recusa do gateway quando o cvv é 000.
    if (details.cvv === '000') throw new Error('Cartão recusado');
  }
}
