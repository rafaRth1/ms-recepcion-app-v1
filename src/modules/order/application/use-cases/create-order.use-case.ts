import { Inject, Injectable } from '@nestjs/common';
import {
   type OrderRepository,
   ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository';
import { DeliveryStatus } from 'src/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/shared/enums/order-status.enum';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { CreateOrderDto, OrderItemDto } from '../../api/dto/create-order.dto';
import { PaymentType } from 'src/shared/enums/payment-type.enum';
import { OrderType } from 'src/shared/enums/order-type.enum';

@Injectable()
export class CreateOrderUseCase {
   constructor(
      @Inject(ORDER_REPOSITORY)
      private readonly orderRepository: OrderRepository,
   ) {}

   async execute(dto: CreateOrderDto, userId: string): Promise<OrderEntity> {
      const isDeliveryOrPickup =
         dto.type === OrderType.DELIVERY || dto.type === OrderType.PICKUP;
      const DISPOSABLE_PRICE = 1.0;

      const order = new OrderEntity();
      order.nameOrder = dto.nameOrder;
      order.items = dto.items.map((item: OrderItemDto) => {
         const orderItem = new OrderItem();
         orderItem.name = item.name;
         orderItem.price = item.price;
         orderItem.type = item.type;
         orderItem.extras = item.extras ?? [];
         orderItem.creams = item.creams ?? [];
         orderItem.chargeDisposable =
            isDeliveryOrPickup && item.chargeDisposable === true;
         return orderItem;
      });

      const itemsTotal = dto.items.reduce((acc, item) => acc + item.price, 0);
      const disposableCount = order.items.filter(
         (item) => item.chargeDisposable,
      ).length;
      const disposableCharge = disposableCount * DISPOSABLE_PRICE;

      order.totalPrice = itemsTotal + disposableCharge;
      order.disposableCharge = disposableCharge;
      order.exception = dto.exception ?? '';
      order.momentaryTime = dto.momentaryTime ?? '';
      order.paymentType = dto.paymentType ?? PaymentType.EFECTIVO;
      order.status = OrderStatus.PROCESS;
      order.deliveryStatus = DeliveryStatus.PROCESS;
      order.type = dto.type;
      order.userId = userId;
      return this.orderRepository.create(order);
   }
}
