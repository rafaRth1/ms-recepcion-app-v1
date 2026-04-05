import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './domain/entities/category.entity';
import { CategoryRepositoryImpl } from './infrastructure/category.repository.impl';
import { CATEGORY_REPOSITORY } from './domain/repositories/category.repository';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { GetCategoriesUseCase } from './application/use-cases/get-categories.use-case';
import { GetCategoryByIdUseCase } from './application/use-cases/get-category-by-id.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from './application/use-cases/delete-category.use-case';
import { CategoryService } from './application/category.service';
import { CategoryController } from './api/category.controller';
import { GetCategoriesPaginatedUseCase } from './application/use-cases/get-categories-paginated.use-case';

@Module({
   imports: [TypeOrmModule.forFeature([CategoryEntity])],
   controllers: [CategoryController],
   providers: [
      {
         provide: CATEGORY_REPOSITORY,
         useClass: CategoryRepositoryImpl,
      },
      CreateCategoryUseCase,
      GetCategoriesUseCase,
      GetCategoryByIdUseCase,
      GetCategoriesPaginatedUseCase,
      UpdateCategoryUseCase,
      DeleteCategoryUseCase,
      CategoryService,
   ],
   exports: [CategoryService],
})
export class CategoryModule {}
