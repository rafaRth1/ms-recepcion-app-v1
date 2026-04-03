import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from '../../domain/entities/product.entity';
import {
   type ICategoryRepository,
   PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';
import { UpdateProductDto } from '../../api/dto/update-product.dto';
import { CategoryService } from '../../../category/application/category.service';

@Injectable()
export class UpdateProductUseCase {
   constructor(
      @Inject(PRODUCT_REPOSITORY)
      private readonly productRepository: ICategoryRepository,
      private readonly categoryService: CategoryService,
   ) {}

   async execute(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
      const product = await this.productRepository.findById(id);

      if (!product) {
         throw new NotFoundException(`Producto con id "${id}" no encontrado`);
      }

      const updated = await this.productRepository.update(id, dto);
      return updated!;
   }
}
