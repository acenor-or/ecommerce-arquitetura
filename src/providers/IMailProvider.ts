export interface EmailMessage {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface EmailResult {
  previewUrl: string | null;
}

// Contrato para envio de e-mail, quem usa não precisa saber qual ferramenta está por trás.
export interface IMailProvider {
  sendMail(message: EmailMessage): Promise<EmailResult>;
}
