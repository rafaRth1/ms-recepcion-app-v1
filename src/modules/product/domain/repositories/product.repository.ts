import { ProductEntity } from '../entities/product.entity';

export interface ProductFilters {
   categorySlug?: string;
   status?: string;
   search?: string;
}

export interface IProductRepository {
   findAll(filters?: ProductFilters): Promise<ProductEntity[]>;
   findById(id: string): Promise<ProductEntity | null>;
   save(product: ProductEntity): Promise<ProductEntity>;
   update(
      id: string,
      data: Partial<ProductEntity>,
   ): Promise<ProductEntity | null>;
   delete(id: string): Promise<boolean>;
}

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';
