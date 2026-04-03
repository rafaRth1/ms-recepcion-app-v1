import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CategoryEntity } from '../domain/entities/category.entity';
import { ICategoryRepository } from '../domain/repositories/category.repository';

export class CategoryRepositoryImpl implements ICategoryRepository {
   constructor(
      @InjectRepository(CategoryEntity)
      private readonly repo: MongoRepository<CategoryEntity>,
   ) {}

   findAll(): Promise<CategoryEntity[]> {
      return this.repo.find();
   }

   async findById(id: string): Promise<CategoryEntity | null> {
      return this.repo.findOneBy({ _id: new ObjectId(id) });
   }

   async findBySlug(slug: string): Promise<CategoryEntity | null> {
      return this.repo.findOneBy({ slug });
   }

   async save(category: CategoryEntity): Promise<CategoryEntity> {
      return this.repo.save(category);
   }

   async update(
      id: string,
      data: Partial<CategoryEntity>,
   ): Promise<CategoryEntity | null> {
      await this.repo.update({ _id: new ObjectId(id) }, data);
      return this.findById(id);
   }

   async delete(id: string): Promise<boolean> {
      const result = await this.repo.delete({ _id: new ObjectId(id) });
      return result.affected === 1;
   }
}
