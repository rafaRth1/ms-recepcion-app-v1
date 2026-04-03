import { Injectable } from '@nestjs/common';
import { CreateCategoryUseCase } from './use-cases/create-category.use-case';
import { GetCategoriesUseCase } from './use-cases/get-categories.use-case';
import { GetCategoryByIdUseCase } from './use-cases/get-category-by-id.use-case';
import { UpdateCategoryUseCase } from './use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from './use-cases/delete-category.use-case';
import { CreateCategoryDto } from '../api/dto/create-category.dto';
import { UpdateCategoryDto } from '../api/dto/update-category.dto';
import { CategoryEntity } from '../domain/entities/category.entity';

@Injectable()
export class CategoryService {
   constructor(
      private readonly createCategoryUseCase: CreateCategoryUseCase,
      private readonly getCategoriesUseCase: GetCategoriesUseCase,
      private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
      private readonly updateCategoryUseCase: UpdateCategoryUseCase,
      private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
   ) {}

   create(dto: CreateCategoryDto): Promise<CategoryEntity> {
      return this.createCategoryUseCase.execute(dto);
   }

   findAll(): Promise<CategoryEntity[]> {
      return this.getCategoriesUseCase.execute();
   }

   findById(id: string): Promise<CategoryEntity> {
      return this.getCategoryByIdUseCase.execute(id);
   }

   update(id: string, dto: UpdateCategoryDto): Promise<CategoryEntity> {
      return this.updateCategoryUseCase.execute(id, dto);
   }

   delete(id: string): Promise<void> {
      return this.deleteCategoryUseCase.execute(id);
   }
}
