import { Status } from 'src/shared/enums/status.enum';
import {
   Column,
   CreateDateColumn,
   Entity,
   ObjectId,
   ObjectIdColumn,
   UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class CategoryEntity {
   @ObjectIdColumn()
   _id: ObjectId;

   @Column({ unique: false })
   name: string;

   @Column({ unique: true })
   slug: string;

   @Column({ nullable: true, default: '' })
   description: string;

   @Column({ nullable: true, default: '' })
   icon: string;

   @Column({
      type: 'enum',
      enum: Status,
      default: Status.ACTIVE,
   })
   status: Status;

   @CreateDateColumn()
   createdAt: Date;

   @UpdateDateColumn()
   updatedAt: Date;
}
