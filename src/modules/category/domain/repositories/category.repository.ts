import { CategoryEntity } from '../entities/category.entity';

export interface ICategoryRepository {
   findAll(): Promise<CategoryEntity[]>;
   findById(id: string): Promise<CategoryEntity | null>;
   findBySlug(slug: string): Promise<CategoryEntity | null>;
   save(category: CategoryEntity): Promise<CategoryEntity>;
   update(
      id: string,
      data: Partial<CategoryEntity>,
   ): Promise<CategoryEntity | null>;
   delete(id: string): Promise<boolean>;
}

export const CATEGORY_REPOSITORY = 'CATEGORY_REPOSITORY';
