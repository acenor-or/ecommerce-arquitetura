import { PrismaClient } from '@prisma/client';
import { IOrderRepository, OrderToSave, PersistedOrder } from './IOrderRepository';

export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(order: OrderToSave): Promise<PersistedOrder> {
    return this.prisma.order.create({ data: order });
  }
}
