import { Inject, Injectable } from '@nestjs/common';
import { ProductEntity } from '../../domain/entities/product.entity';
import {
   type IProductRepository,
   PRODUCT_REPOSITORY,
   ProductFilters,
} from '../../domain/repositories/product.repository';

@Injectable()
export class GetProductsUseCase {
   constructor(
      @Inject(PRODUCT_REPOSITORY)
      private readonly productRepository: IProductRepository,
   ) {}

   execute(filters?: ProductFilters): Promise<ProductEntity[]> {
      return this.productRepository.findAll(filters);
   }
}
