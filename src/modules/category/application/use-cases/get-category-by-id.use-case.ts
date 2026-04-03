// modules/category/application/use-cases/get-category-by-id.use-case.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryEntity } from '../../domain/entities/category.entity';
import {
   type ICategoryRepository,
   CATEGORY_REPOSITORY,
} from '../../domain/repositories/category.repository';

@Injectable()
export class GetCategoryByIdUseCase {
   constructor(
      @Inject(CATEGORY_REPOSITORY)
      private readonly categoryRepository: ICategoryRepository,
   ) {}

   async execute(id: string): Promise<CategoryEntity> {
      const category = await this.categoryRepository.findById(id);

      if (!category) {
         throw new NotFoundException(`Categoría con id "${id}" no encontrada`);
      }

      return category;
   }
}
