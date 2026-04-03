import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
   type ICategoryRepository,
   PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';

@Injectable()
export class DeleteProductUseCase {
   constructor(
      @Inject(PRODUCT_REPOSITORY)
      private readonly productRepository: ICategoryRepository,
   ) {}

   async execute(id: string): Promise<void> {
      const product = await this.productRepository.findById(id);

      if (!product) {
         throw new NotFoundException(`Producto con id "${id}" no encontrado`);
      }

      await this.productRepository.delete(id);
   }
}
