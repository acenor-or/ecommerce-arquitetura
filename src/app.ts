import express from 'express';
import { PrismaClient } from '@prisma/client';
import { OrderController } from './controllers/OrderController';
import { OrderService } from './services/OrderService';
import { NotificationService } from './services/NotificationService';
import { EtherealMailProvider } from './providers/EtherealMailProvider';
import { PrismaOrderRepository } from './repositories/PrismaOrderRepository';
import { PrismaProductRepository } from './repositories/PrismaProductRepository';
import { PaymentRegistry } from './payments/PaymentRegistry';
import { CreditCardPayment } from './payments/CreditCardPayment';
import { DebitCardPayment } from './payments/DebitCardPayment';
import { PixPayment } from './payments/PixPayment';

const prismaClient = new PrismaClient();

// Formas de pagamento aceitas (nova forma = novo register, sem mexer no service)
const paymentRegistry = new PaymentRegistry()
  .register('credit_card', new CreditCardPayment())
  .register('debit_card', new DebitCardPayment())
  .register('pix', new PixPayment());

// Aqui é o único lugar onde as implementações concretas são escolhidas.
const orderService = new OrderService(
  new PrismaProductRepository(prismaClient),
  new PrismaOrderRepository(prismaClient),
  paymentRegistry,
  new NotificationService(new EtherealMailProvider()),
);

const orderController = new OrderController(orderService);

const app = express();
app.use(express.json());

app.post('/orders', orderController.createOrder);

export default app;
