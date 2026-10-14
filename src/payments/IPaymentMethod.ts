export type PaymentDetails = Record<string, any>;

// Toda forma de pagamento implementa este contrato.
export interface IPaymentMethod {
  process(details: PaymentDetails): Promise<void>;
}
