// Formato cru do produto, do jeito que vem do banco.
export interface ProductRecord {
  id: number;
  name: string;
  type: string;
  price: number;
}

// Contrato que todo produto do domínio precisa seguir.
export interface IProduct {
  readonly id: number;
  readonly name: string;
  readonly type: string;
  readonly price: number;
  calculateFreight(): number;
}
