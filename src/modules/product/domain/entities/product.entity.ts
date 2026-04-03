import { Status } from 'src/shared/enums/status.enum';
import {
   Column,
   CreateDateColumn,
   Entity,
   ObjectId,
   ObjectIdColumn,
   UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class ProductEntity {
   @ObjectIdColumn()
   _id: ObjectId;

   @Column()
   name: string;

   @Column()
   price: number;

   @Column({ default: 0 })
   discount: number;

   @Column({ nullable: true, default: '' })
   image: string;

   @Column({ nullable: true, default: '' })
   description: string;

   @Column('array', { default: [] })
   ingredients: string[];

   @Column('array', { default: [] })
   tags: string[];

   @Column('array', { default: [] })
   categoryIds: string[];

   @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
   status: Status;

   @CreateDateColumn()
   createdAt: Date;

   @UpdateDateColumn()
   updatedAt: Date;
}
