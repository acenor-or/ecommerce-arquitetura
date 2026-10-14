import logger from '../lib/logger';
import { IPaymentMethod } from './IPaymentMethod';

export class DebitCardPayment implements IPaymentMethod {
  async process(): Promise<void> {
    logger.info('Processando débito...');
  }
}
