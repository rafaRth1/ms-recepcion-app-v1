import {
   Entity,
   ObjectIdColumn,
   Column,
   CreateDateColumn,
   UpdateDateColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/shared/enums/user-role.enum';

@Entity('users')
export class UserEntity {
   @ObjectIdColumn()
   _id: ObjectId;

   @Column({ unique: true })
   email: string;

   @Column()
   nickName: string;

   @Column()
   password: string;

   @Column({ enum: UserRole, default: UserRole.CASHIER })
   role: UserRole;

   @Column({ nullable: true, default: '' })
   token: string;

   @CreateDateColumn()
   createdAt: Date;

   @UpdateDateColumn()
   updatedAt: Date;

   async checkPassword(password: string): Promise<boolean> {
      return bcrypt.compare(password, this.password);
   }
}
