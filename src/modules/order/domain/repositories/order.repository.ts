import { OrderEntity } from '../entities/order.entity';

export interface OrderRepository {
   create(order: OrderEntity): Promise<OrderEntity>;
   findAll(): Promise<OrderEntity[]>;
   findById(id: string): Promise<OrderEntity | null>;
   update(id: string, order: Partial<OrderEntity>): Promise<OrderEntity | null>;
   delete(id: string): Promise<void>;
}

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';
