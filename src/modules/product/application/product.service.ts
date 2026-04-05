import { Injectable } from '@nestjs/common';
import { CreateProductUseCase } from './use-cases/create-product.use-case';
import { GetProductsUseCase } from './use-cases/get-products.use-case';
import { GetProductByIdUseCase } from './use-cases/get-product-by-id.use-case';
import { UpdateProductUseCase } from './use-cases/update-product.use-case';
import { DeleteProductUseCase } from './use-cases/delete-product.use-case';
import { CreateProductDto } from '../api/dto/create-product.dto';
import { UpdateProductDto } from '../api/dto/update-product.dto';
import { ProductEntity } from '../domain/entities/product.entity';
import { ProductFilters } from '../domain/repositories/product.repository';
import { GetProductsPaginatedDto } from '../api/dto/get-products-paginated.dto';
import { PaginatedResult } from 'src/shared/interfaces/paginated-result.interface';
import { GetProductsPaginatedUseCase } from './use-cases/get-products-paginated.use-case';

@Injectable()
export class ProductService {
   constructor(
      private readonly createProductUseCase: CreateProductUseCase,
      private readonly getProductsUseCase: GetProductsUseCase,
      private readonly getProductsPaginatedUseCase: GetProductsPaginatedUseCase,
      private readonly getProductByIdUseCase: GetProductByIdUseCase,
      private readonly updateProductUseCase: UpdateProductUseCase,
      private readonly deleteProductUseCase: DeleteProductUseCase,
   ) {}

   create(dto: CreateProductDto): Promise<ProductEntity> {
      return this.createProductUseCase.execute(dto);
   }

   findAll(filters?: ProductFilters): Promise<ProductEntity[]> {
      return this.getProductsUseCase.execute(filters);
   }

   findById(id: string): Promise<ProductEntity> {
      return this.getProductByIdUseCase.execute(id);
   }

   findPaginated(
      dto: GetProductsPaginatedDto,
   ): Promise<PaginatedResult<ProductEntity[]>> {
      return this.getProductsPaginatedUseCase.execute(dto);
   }

   update(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
      return this.updateProductUseCase.execute(id, dto);
   }

   async delete(id: string): Promise<void> {
      await this.deleteProductUseCase.execute(id);
   }
}
