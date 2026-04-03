import { Inject, Injectable } from '@nestjs/common';
import { OrderEntity } from '../../domain/entities/order.entity';
import {
   type OrderRepository,
   ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository';

@Injectable()
export class GetOrdersUseCase {
   constructor(
      @Inject(ORDER_REPOSITORY)
      private readonly orderRepository: OrderRepository,
   ) {}

   async execute(): Promise<OrderEntity[]> {
      return this.orderRepository.findAll();
   }
}
