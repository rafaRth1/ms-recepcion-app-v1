import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import {
   type OrderRepository,
   ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository';
import { UpdateOrderDto } from '../../api/dto/update-order.dto';

@Injectable()
export class UpdateOrderUseCase {
   constructor(
      @Inject(ORDER_REPOSITORY)
      private readonly orderRepository: OrderRepository,
   ) {}

   async execute(id: string, dto: UpdateOrderDto): Promise<OrderEntity> {
      const order = await this.orderRepository.findById(id);
      if (!order) {
         throw new NotFoundException(`Order with id ${id} not found`);
      }

      const { items, ...restData } = dto;
      const updateData: Partial<OrderEntity> = { ...restData };

      if (items) {
         updateData.items = items.map((item) => {
            const orderItem = new OrderItem();
            orderItem.name = item.name;
            orderItem.price = item.price;
            orderItem.type = item.type;
            orderItem.extras = item.extras ?? [];
            orderItem.creams = item.creams ?? [];
            orderItem.chargeDisposable = item.chargeDisposable ?? false;
            return orderItem;
         });
      }

      const updated = await this.orderRepository.update(id, updateData);
      return updated!;
   }
}
