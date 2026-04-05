import { ProductEntity } from '../entities/product.entity';

export interface ProductWithCategories extends ProductEntity {
   categoryNames: string[];
}
