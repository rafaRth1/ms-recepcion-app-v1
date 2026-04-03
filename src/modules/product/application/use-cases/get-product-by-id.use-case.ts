import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from '../../domain/entities/product.entity';
import {
   type ICategoryRepository,
   PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';

@Injectable()
export class GetProductByIdUseCase {
   constructor(
      @Inject(PRODUCT_REPOSITORY)
      private readonly productRepository: ICategoryRepository,
   ) {}

   async execute(id: string): Promise<ProductEntity> {
      const product = await this.productRepository.findById(id);

      if (!product) {
         throw new NotFoundException(`Producto con id "${id}" no encontrado`);
      }

      return product;
   }
}
