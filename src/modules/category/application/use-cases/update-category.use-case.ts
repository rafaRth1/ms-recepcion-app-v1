import {
   Inject,
   Injectable,
   NotFoundException,
   ConflictException,
} from '@nestjs/common';
import { CategoryEntity } from '../../domain/entities/category.entity';
import {
   type ICategoryRepository,
   CATEGORY_REPOSITORY,
} from '../../domain/repositories/category.repository';
import { UpdateCategoryDto } from '../../api/dto/update-category.dto';

@Injectable()
export class UpdateCategoryUseCase {
   constructor(
      @Inject(CATEGORY_REPOSITORY)
      private readonly categoryRepository: ICategoryRepository,
   ) {}

   async execute(id: string, dto: UpdateCategoryDto): Promise<CategoryEntity> {
      const category = await this.categoryRepository.findById(id);

      if (!category) {
         throw new NotFoundException(`Categoría con id "${id}" no encontrada`);
      }

      if (dto.slug) {
         const existing = await this.categoryRepository.findBySlug(dto.slug);
         if (existing && existing._id.toString() !== id) {
            throw new ConflictException(
               `Ya existe una categoría con el slug "${dto.slug}"`,
            );
         }
      }

      const updated = await this.categoryRepository.update(id, dto);
      return updated!;
   }
}
