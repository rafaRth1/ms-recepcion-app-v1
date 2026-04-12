import { DeliveryStatus } from 'src/shared/enums/delivery-status.enum';
import { PaymentType } from 'src/shared/enums/payment-type.enum';
import {
   Column,
   CreateDateColumn,
   Entity,
   ObjectId,
   ObjectIdColumn,
   UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from 'src/shared/enums/order-status.enum';
import { OrderType } from 'src/shared/enums/order-type.enum';

@Entity('orders')
export class OrderEntity {
   @ObjectIdColumn()
   _id: ObjectId;

   @Column()
   nameOrder: string;

   @Column('array', { default: [] })
   items: OrderItem[];

   @Column({ nullable: true, default: 0 })
   totalPrice: number;

   @Column({ nullable: true, default: 0 })
   disposableCharge: number;

   @Column({ nullable: true, default: '' })
   exception: string;

   @Column({ nullable: true })
   momentaryTime: string;

   @Column({ nullable: true })
   paymentType: PaymentType;

   @Column({ enum: OrderStatus })
   status: OrderStatus;

   @Column({ enum: DeliveryStatus })
   deliveryStatus: DeliveryStatus;

   @Column({ nullable: true, enum: OrderType })
   type: OrderType;

   @Column()
   userId: string;

   @CreateDateColumn()
   createdAt: Date;

   @UpdateDateColumn()
   updatedAt: Date;
}
