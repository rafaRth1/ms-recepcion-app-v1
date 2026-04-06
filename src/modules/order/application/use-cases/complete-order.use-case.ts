import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
   type OrderRepository,
   ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderStatus } from 'src/shared/enums/order-status.enum';

@Injectable()
export class CompleteOrderUseCase {
   constructor(
      @Inject(ORDER_REPOSITORY)
      private readonly orderRepository: OrderRepository,
   ) {}

   async execute(id: string): Promise<OrderEntity> {
      const order = await this.orderRepository.findById(id);
      if (!order) throw new NotFoundException('Orden no encontrada');

      const updated = await this.orderRepository.update(id, {
         status: OrderStatus.COMPLETED,
      });

      if (!updated) throw new NotFoundException('Error al completar la orden');

      return updated;
   }
}
