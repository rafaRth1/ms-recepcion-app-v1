import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CategoryEntity } from '../../domain/entities/category.entity';
import {
   type ICategoryRepository,
   CATEGORY_REPOSITORY,
} from '../../domain/repositories/category.repository';
import { CreateCategoryDto } from '../../api/dto/create-category.dto';
import { Status } from 'src/shared/enums/status.enum';

@Injectable()
export class CreateCategoryUseCase {
   constructor(
      @Inject(CATEGORY_REPOSITORY)
      private readonly categoryRepository: ICategoryRepository,
   ) {}

   async execute(dto: CreateCategoryDto): Promise<CategoryEntity> {
      const existing = await this.categoryRepository.findBySlug(dto.slug);

      if (existing) {
         throw new ConflictException(
            `Ya existe una categoría con el slug '${dto.slug}'`,
         );
      }

      const category = new CategoryEntity();
      category.name = dto.name;
      category.slug = dto.slug;
      category.description = dto.description ?? '';
      category.icon = dto.icon ?? '';
      category.status = Status.ACTIVE;

      return this.categoryRepository.save(category);
   }
}
