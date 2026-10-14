import { Request, Response } from 'express';
import logger from '../lib/logger';
import { OrderError } from '../errors/OrderError';
import { OrderService } from '../services/OrderService';

// Camada HTTP: lê o request, chama o service e monta a resposta.
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  createOrder = async (req: Request, res: Response) => {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body;

      const output = await this.orderService.placeOrder({
        customer,
        items,
        paymentMethod,
        paymentDetails,
      });

      return res.json({
        message: 'Pedido processado com sucesso',
        orderId: output.orderId,
        emailPreview: output.emailPreview, // link do Ethereal
      });
    } catch (error: unknown) {
      if (error instanceof OrderError) {
        return res.status(error.httpStatus).json({ error: error.message });
      }

      const reason = error instanceof Error ? error.message : String(error);
      logger.error(`Erro ao processar pedido: ${reason}`);
      return res.status(500).json({ error: 'Erro interno' });
    }
  };
}
