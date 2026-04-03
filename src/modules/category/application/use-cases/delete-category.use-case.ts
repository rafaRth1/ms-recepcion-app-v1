import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
   type ICategoryRepository,
   CATEGORY_REPOSITORY,
} from '../../domain/repositories/category.repository';

@Injectable()
export class DeleteCategoryUseCase {
   constructor(
      @Inject(CATEGORY_REPOSITORY)
      private readonly categoryRepository: ICategoryRepository,
   ) {}

   async execute(id: string): Promise<void> {
      const category = await this.categoryRepository.findById(id);

      if (!category) {
         throw new NotFoundException(`Categoría con id "${id}" no encontrada`);
      }

      await this.categoryRepository.delete(id);
   }
}
