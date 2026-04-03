import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderEntity } from '../../domain/entities/order.entity';
import {
   type OrderRepository,
   ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository';

@Injectable()
export class GetOrderByIdUseCase {
   constructor(
      @Inject(ORDER_REPOSITORY)
      private readonly orderRepository: OrderRepository,
   ) {}

   async execute(id: string): Promise<OrderEntity> {
      const order = await this.orderRepository.findById(id);
      if (!order) {
         throw new NotFoundException(`Order con ID ${id} no encontrado`);
      }
      return order;
   }
}
