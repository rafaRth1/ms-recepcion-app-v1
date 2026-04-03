import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { OrderRepository } from '../domain/repositories/order.repository';
import { OrderEntity } from '../domain/entities/order.entity';

export class OrderRepositoryImpl implements OrderRepository {
   constructor(
      @InjectRepository(OrderEntity)
      private readonly repository: MongoRepository<OrderEntity>,
   ) {}

   async create(order: OrderEntity): Promise<OrderEntity> {
      return this.repository.save(order);
   }

   async findAll(): Promise<OrderEntity[]> {
      return this.repository.find();
   }

   async findById(id: string): Promise<OrderEntity | null> {
      return this.repository.findOneBy({ _id: new ObjectId(id) });
   }

   async update(
      id: string,
      order: Partial<OrderEntity>,
   ): Promise<OrderEntity | null> {
      await this.repository.update({ _id: new ObjectId(id) }, order);
      return this.findById(id);
   }

   async delete(id: string): Promise<void> {
      await this.repository.delete({ _id: new ObjectId(id) });
   }
}
