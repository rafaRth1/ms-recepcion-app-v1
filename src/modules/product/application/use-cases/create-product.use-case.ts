import { Inject, Injectable } from '@nestjs/common';
import { ProductEntity } from '../../domain/entities/product.entity';
import {
   type ICategoryRepository,
   PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';
import { CategoryService } from '../../../category/application/category.service';
import { CreateProductDto } from '../../api/dto/create-product.dto';
import { Status } from 'src/shared/enums/status.enum';

@Injectable()
export class CreateProductUseCase {
   constructor(
      @Inject(PRODUCT_REPOSITORY)
      private readonly productRepository: ICategoryRepository,
      private readonly categoryService: CategoryService,
   ) {}

   async execute(dto: CreateProductDto): Promise<ProductEntity> {
      const product = new ProductEntity();
      product.name = dto.name;
      product.price = dto.price;
      product.discount = dto.discount ?? 0;
      product.image = dto.image ?? '';
      product.description = dto.description ?? '';
      product.ingredients = dto.ingredients ?? [];
      product.tags = dto.tags ?? [];
      product.categoryIds = dto.categoryIds;
      product.status = Status.ACTIVE;
      return this.productRepository.save(product);
   }
}
