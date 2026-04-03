import { OrderItemType } from 'src/shared/enums/order-item-type.enum';
import { Column } from 'typeorm';

export class OrderItem {
   @Column()
   type: OrderItemType;

   @Column()
   name: string;

   @Column()
   price: number;

   @Column('array', { default: [] })
   extras: string[];

   @Column('array', { default: [] })
   creams: string[];
}
