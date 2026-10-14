import logger from '../lib/logger';
import { OrderError } from '../errors/OrderError';
import { IProduct } from '../domain/IProduct';
import { ProductFactory } from '../domain/ProductFactory';
import { PaymentDetails } from '../payments/IPaymentMethod';
import { PaymentRegistry } from '../payments/PaymentRegistry';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { IProductRepository } from '../repositories/IProductRepository';
import { NotificationService } from './NotificationService';

export interface RequestedItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderInput {
  customer: string;
  items?: RequestedItem[];
  paymentMethod: string;
  paymentDetails: PaymentDetails;
}

export interface CreateOrderOutput {
  orderId: number;
  emailPreview: string | null;
}

interface CartLine {
  product: IProduct;
  quantity: number;
}

// Orquestra o pedido: valida -> calcula -> paga -> salva -> notifica.
export class OrderService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly paymentRegistry: PaymentRegistry,
    private readonly notificationService: NotificationService,
  ) {}

  async placeOrder(input: CreateOrderInput): Promise<CreateOrderOutput> {
    const { customer, items, paymentMethod, paymentDetails } = input;

    // 1. Validação
    if (!items || items.length === 0) {
      logger.error('Tentativa de pedido sem itens');
      throw new OrderError('Carrinho vazio');
    }

    // 2. Total do pedido (preço x quantidade + frete de cada produto)
    const cartLines = await this.buildCartLines(items);
    const orderTotal = cartLines.reduce(
      (acc, { product, quantity }) => acc + product.price * quantity + product.calculateFreight(),
      0,
    );

    // 3. Pagamento
    const payment = this.paymentRegistry.resolve(paymentMethod);
    if (!payment) {
      throw new OrderError('Método de pagamento não suportado');
    }
    await payment.process(paymentDetails);

    // 4. Persistência
    const savedOrder = await this.orderRepository.save({
      customer,
      items: JSON.stringify(
        cartLines.map(({ product, quantity }) => ({
          id: product.id,
          name: product.name,
          type: product.type,
          price: product.price,
          quantity,
        })),
      ),
      total: orderTotal,
      status: 'confirmed',
    });

    // 5. Notificação
    const emailPreview = await this.notificationService.notifyOrderConfirmed({
      customer,
      orderId: savedOrder.id,
      total: orderTotal,
      productNames: cartLines.map(({ product }) => product.name),
    });

    return { orderId: savedOrder.id, emailPreview };
  }

  // Busca cada produto no repositório e converte para o objeto de domínio.
  private async buildCartLines(items: RequestedItem[]): Promise<CartLine[]> {
    const cartLines: CartLine[] = [];

    for (const item of items) {
      const record = await this.productRepository.findById(item.productId);
      if (!record) {
        throw new OrderError(`Produto ${item.productId} não encontrado`);
      }
      cartLines.push({ product: ProductFactory.createProduct(record), quantity: item.quantity });
    }

    return cartLines;
  }
}
