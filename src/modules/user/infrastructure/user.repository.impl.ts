import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { UserEntity } from '../domain/entities/user.entity';
import { UserRepository } from '../domain/repositories/user.repository';
import { ObjectId } from 'mongodb';

export class UserTypeormRepository implements UserRepository {
   constructor(
      @InjectRepository(UserEntity)
      private readonly repo: MongoRepository<UserEntity>,
   ) {}

   async findByEmail(email: string): Promise<UserEntity | null> {
      return this.repo.findOneBy({ email });
   }

   async findByToken(token: string): Promise<UserEntity | null> {
      return this.repo.findOneBy({ token });
   }

   async findById(id: string): Promise<UserEntity | null> {
      const objectId = new ObjectId(id);
      return this.repo.findOneBy({ _id: objectId });
   }

   async save(data: Partial<UserEntity>): Promise<UserEntity> {
      const user = this.repo.create(data);
      return this.repo.save(user);
   }

   async update(id: string, data: Partial<UserEntity>): Promise<void> {
      await this.repo.update(id, data);
   }
}
