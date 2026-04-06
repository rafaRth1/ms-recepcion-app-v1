import { Inject, Injectable } from '@nestjs/common';
import { ProductEntity } from '../../domain/entities/product.entity';
import {
   type IProductRepository,
   PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';
import { CategoryService } from '../../../category/application/category.service';
import { CreateProductDto } from '../../api/dto/create-product.dto';
import { Status } from 'src/shared/enums/status.enum';
import { CategoryEmbed } from '../../domain/entities/category-embed';

@Injectable()
export class CreateProductUseCase {
   constructor(
      @Inject(PRODUCT_REPOSITORY)
      private readonly productRepository: IProductRepository,
      private readonly categoryService: CategoryService,
   ) {}

   async execute(dto: CreateProductDto): Promise<ProductEntity> {
      const categories = await Promise.all(
         dto.categoryIds.map(async (id) => {
            const category = await this.categoryService.findById(id);
            const embed = new CategoryEmbed();
            embed._id = category._id.toString();
            embed.name = category.name;
            embed.slug = category.slug;
            return embed;
         }),
      );

      const product = new ProductEntity();
      product.name = dto.name;
      product.price = dto.price;
      product.discount = dto.discount ?? 0;
      product.image = dto.image ?? '';
      product.description = dto.description ?? '';
      product.ingredients = dto.ingredients ?? [];
      product.type = dto.type;
      product.tags = dto.tags ?? [];
      product.categories = categories;
      product.status = Status.ACTIVE;

      return this.productRepository.save(product);
   }
}
