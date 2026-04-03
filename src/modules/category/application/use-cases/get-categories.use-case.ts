import { Inject, Injectable } from '@nestjs/common';
import { CategoryEntity } from '../../domain/entities/category.entity';
import {
   type ICategoryRepository,
   CATEGORY_REPOSITORY,
} from '../../domain/repositories/category.repository';

@Injectable()
export class GetCategoriesUseCase {
   constructor(
      @Inject(CATEGORY_REPOSITORY)
      private readonly categoryRepository: ICategoryRepository,
   ) {}

   execute(): Promise<CategoryEntity[]> {
      return this.categoryRepository.findAll();
   }
}
