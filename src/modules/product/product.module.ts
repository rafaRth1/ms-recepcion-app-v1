import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './domain/entities/product.entity';
import { ProductRepositoryImpl } from './infrastructure/product.repository.impl';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { GetProductByIdUseCase } from './application/use-cases/get-product-by-id.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { ProductService } from './application/product.service';
import { ProductController } from './api/product.controller';
import { CategoryModule } from '../category/category.module';
import { GetProductsPaginatedUseCase } from './application/use-cases/get-products-paginated.use-case';
import { CategoryEntity } from '../category/domain/entities/category.entity';

@Module({
   imports: [
      TypeOrmModule.forFeature([ProductEntity, CategoryEntity]),
      CategoryModule,
   ],
   controllers: [ProductController],
   providers: [
      {
         provide: PRODUCT_REPOSITORY,
         useClass: ProductRepositoryImpl,
      },
      CreateProductUseCase,
      GetProductsUseCase,
      GetProductByIdUseCase,
      GetProductsPaginatedUseCase,
      UpdateProductUseCase,
      DeleteProductUseCase,
      ProductService,
   ],
   exports: [ProductService],
})
export class ProductModule {}
