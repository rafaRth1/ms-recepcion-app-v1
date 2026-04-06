import { ProductType } from 'src/shared/enums/product-type.enum';
import { Column } from 'typeorm';

export class OrderItem {
   @Column()
   type: ProductType;

   @Column()
   name: string;

   @Column()
   price: number;

   @Column('array', { default: [] })
   extras: string[];

   @Column('array', { default: [] })
   creams: string[];
}
