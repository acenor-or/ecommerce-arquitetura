export interface OrderToSave {
  customer: string;
  items: string;
  total: number;
  status: string;
}

export interface PersistedOrder {
  id: number;
}

export interface IOrderRepository {
  save(order: OrderToSave): Promise<PersistedOrder>;
}
