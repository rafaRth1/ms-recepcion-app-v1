import { Injectable } from '@nestjs/common';
import { CreateOrderUseCase } from './use-cases/create-order.use-case';
import { GetOrdersUseCase } from './use-cases/get-orders.use-case';
import { GetOrderByIdUseCase } from './use-cases/get-order-by-id.use-case';
import { UpdateOrderUseCase } from './use-cases/update-order.use-case';
import { CreateOrderDto } from '../api/dto/create-order.dto';
import { UpdateOrderDto } from '../api/dto/update-order.dto';
import { OrderEntity } from '../domain/entities/order.entity';
import { CompleteOrderUseCase } from './use-cases/complete-order.use-case';

@Injectable()
export class OrderService {
   constructor(
      private readonly createOrderUseCase: CreateOrderUseCase,
      private readonly getOrdersUseCase: GetOrdersUseCase,
      private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
      private readonly updateOrderUseCase: UpdateOrderUseCase,
      private readonly completeOrderUseCase: CompleteOrderUseCase,
   ) {}

   async create(dto: CreateOrderDto, userId: string): Promise<OrderEntity> {
      return this.createOrderUseCase.execute(dto, userId);
   }

   async findAll(): Promise<OrderEntity[]> {
      return this.getOrdersUseCase.execute();
   }

   async findById(id: string): Promise<OrderEntity> {
      return this.getOrderByIdUseCase.execute(id);
   }

   async update(id: string, dto: UpdateOrderDto): Promise<OrderEntity> {
      return this.updateOrderUseCase.execute(id, dto);
   }

   async complete(id: string): Promise<OrderEntity> {
      return this.completeOrderUseCase.execute(id);
   }
}
