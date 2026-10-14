import logger from '../lib/logger';
import { IMailProvider } from '../providers/IMailProvider';

export interface OrderNotification {
  customer: string;
  orderId: number;
  total: number;
  productNames: string[];
}

// Decide o conteúdo do e-mail; o envio em si fica com o provider.
export class NotificationService {
  constructor(private readonly mailProvider: IMailProvider) {}

  async notifyOrderConfirmed(notification: OrderNotification): Promise<string | null> {
    const { previewUrl } = await this.mailProvider.sendMail({
      from: '"DevStore" <noreply@devstore.com>',
      to: notification.customer,
      subject: `Confirmação do Pedido #${notification.orderId}`,
      text: `Olá, seu pedido #${notification.orderId} no valor de R$ ${notification.total} foi confirmado.`,
      html: `
          <h1>Pedido Confirmado!</h1>
          <p>Olá, seu pedido <b>#${notification.orderId}</b> foi processado com sucesso.</p>
          <p>Total: <strong>R$ ${notification.total}</strong></p>
          <ul>
            ${notification.productNames.map((name) => `<li>${name}</li>`).join('')}
          </ul>
        `,
    });

    // Link para ver o e-mail no Ethereal
    logger.info(`Email enviado: ${previewUrl}`);
    return previewUrl;
  }
}
