import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ProductEntity } from '../domain/entities/product.entity';
import {
   IProductRepository,
   ProductFilters,
} from '../domain/repositories/product.repository';

export class ProductRepositoryImpl implements IProductRepository {
   constructor(
      @InjectRepository(ProductEntity)
      private readonly repo: MongoRepository<ProductEntity>,
   ) {}

   findAll(filters?: ProductFilters): Promise<ProductEntity[]> {
      const where: Record<string, unknown> = {};

      if (filters?.status) {
         where['status'] = filters.status;
      }

      if (filters?.categorySlug) {
         where['categories.slug'] = filters.categorySlug;
      }

      if (filters?.search) {
         where['name'] = new RegExp(filters.search, 'i');
      }

      return this.repo.find({ where });
   }

   async findById(id: string): Promise<ProductEntity | null> {
      return this.repo.findOneBy({ _id: new ObjectId(id) });
   }

   async save(product: ProductEntity): Promise<ProductEntity> {
      return this.repo.save(product);
   }

   async update(
      id: string,
      data: Partial<ProductEntity>,
   ): Promise<ProductEntity | null> {
      await this.repo.update({ _id: new ObjectId(id) }, data);
      return this.findById(id);
   }

   async delete(id: string): Promise<boolean> {
      const result = await this.repo.delete({ _id: new ObjectId(id) });
      return result.affected === 1;
   }
}
