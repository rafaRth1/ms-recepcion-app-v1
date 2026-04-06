import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from '../../domain/entities/product.entity';
import {
   type IProductRepository,
   PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';
import { UpdateProductDto } from '../../api/dto/update-product.dto';
import { CategoryService } from '../../../category/application/category.service';
import { CategoryEmbed } from '../../domain/entities/category-embed';

@Injectable()
export class UpdateProductUseCase {
   constructor(
      @Inject(PRODUCT_REPOSITORY)
      private readonly productRepository: IProductRepository,
      private readonly categoryService: CategoryService,
   ) {}

   async execute(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
      const product = await this.productRepository.findById(id);
      if (!product) {
         throw new NotFoundException(`Producto con id "${id}" no encontrado`);
      }

      const updateData: Partial<ProductEntity> = {
         ...(dto.name && { name: dto.name }),
         ...(dto.price !== undefined && { price: dto.price }),
         ...(dto.discount !== undefined && { discount: dto.discount }),
         ...(dto.image && { image: dto.image }),
         ...(dto.description && { description: dto.description }),
         ...(dto.ingredients && { ingredients: dto.ingredients }),
         ...(dto.tags && { tags: dto.tags }),
         ...(dto.status && { status: dto.status }),
      };

      if (dto.categoryIds && dto.categoryIds.length > 0) {
         const categories = await Promise.all(
            dto.categoryIds.map(async (categoryId) => {
               const category = await this.categoryService.findById(categoryId);
               const embed = new CategoryEmbed();
               embed._id = category._id.toString();
               embed.name = category.name;
               embed.slug = category.slug;
               return embed;
            }),
         );
         updateData.categories = categories;
      }

      const updated = await this.productRepository.update(id, updateData);
      return updated!;
   }
}
