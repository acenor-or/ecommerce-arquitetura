import nodemailer from 'nodemailer';
import logger from '../lib/logger';
import { IMailProvider, EmailMessage, EmailResult } from './IMailProvider';

// Só esta classe conhece o nodemailer e o Ethereal.
export class EtherealMailProvider implements IMailProvider {
  private cachedTransporter: nodemailer.Transporter | null = null;

  private async obtainTransporter(): Promise<nodemailer.Transporter> {
    if (this.cachedTransporter) return this.cachedTransporter;

    // Gera uma conta de teste no Ethereal na primeira vez que for usado
    const account = await nodemailer.createTestAccount();

    this.cachedTransporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    logger.info(`Ethereal Mail configurado: ${account.user}`);
    return this.cachedTransporter;
  }

  async sendMail(message: EmailMessage): Promise<EmailResult> {
    const transporter = await this.obtainTransporter();
    const info = await transporter.sendMail(message);
    const url = nodemailer.getTestMessageUrl(info);
    return { previewUrl: url || null };
  }
}
