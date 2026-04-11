import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './domain/entities/order.entity';
import { OrderRepositoryImpl } from './infrastructure/order.repository.impl';
import { ORDER_REPOSITORY } from './domain/repositories/order.repository';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { GetOrdersUseCase } from './application/use-cases/get-orders.use-case';
import { GetOrderByIdUseCase } from './application/use-cases/get-order-by-id.use-case';
import { UpdateOrderUseCase } from './application/use-cases/update-order.use-case';
import { OrderService } from './application/order.service';
import { OrderController } from './api/order.controller';
import { CompleteOrderUseCase } from './application/use-cases/complete-order.use-case';
import { GetOrdersPaginatedUseCase } from './application/use-cases/get-orders-paginated.use-case';

@Module({
   imports: [TypeOrmModule.forFeature([OrderEntity])],
   controllers: [OrderController],
   providers: [
      {
         provide: ORDER_REPOSITORY,
         useClass: OrderRepositoryImpl,
      },
      CreateOrderUseCase,
      GetOrdersUseCase,
      GetOrderByIdUseCase,
      UpdateOrderUseCase,
      CompleteOrderUseCase,
      GetOrdersPaginatedUseCase,
      OrderService,
   ],
   exports: [OrderService],
})
export class OrderModule {}
