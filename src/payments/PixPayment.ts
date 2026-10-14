import logger from '../lib/logger';
import { IPaymentMethod } from './IPaymentMethod';

export class PixPayment implements IPaymentMethod {
  async process(): Promise<void> {
    logger.info('Processando Pix...');
  }
}
