import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ProductEntity } from '../../domain/entities/product.entity';
import { CategoryEntity } from 'src/modules/category/domain/entities/category.entity';
import { GetProductsPaginatedDto } from '../../api/dto/get-products-paginated.dto';
import { PaginatedResult } from 'src/shared/interfaces/paginated-result.interface';
import { ProductWithCategories } from '../../domain/interfaces/product-with-categories.interface';

@Injectable()
export class GetProductsPaginatedUseCase {
   constructor(
      @InjectRepository(ProductEntity)
      private readonly productRepository: MongoRepository<ProductEntity>,
      @InjectRepository(CategoryEntity)
      private readonly categoryRepository: MongoRepository<CategoryEntity>,
   ) {}

   async execute(
      dto: GetProductsPaginatedDto,
   ): Promise<PaginatedResult<ProductWithCategories[]>> {
      const {
         page = 1,
         limit = 10,
         search,
         categoryId,
         minPrice,
         maxPrice,
         status,
      } = dto;

      const where: Record<string, unknown> = {};

      if (search) where.name = { $regex: search, $options: 'i' };
      if (categoryId) where.categoryIds = categoryId;
      if (minPrice !== undefined || maxPrice !== undefined) {
         where.price = {
            ...(minPrice !== undefined && { $gte: minPrice }),
            ...(maxPrice !== undefined && { $lte: maxPrice }),
         };
      }
      if (status) where.status = status;

      const [products, total] = await this.productRepository.findAndCount({
         where,
         skip: (page - 1) * limit,
         take: limit,
         order: { createdAt: 'DESC' },
      });

      // Resolver nombres de categorías
      const allCategoryIds = [
         ...new Set(products.flatMap((p) => p.categoryIds)),
      ];

      const objectIds = allCategoryIds.map((id) => new ObjectId(id));

      const categories = allCategoryIds.length
         ? await this.categoryRepository.find({
              where: {
                 _id: { $in: objectIds } as unknown,
              },
           })
         : [];

      const categoryMap = new Map(
         categories.map((c) => [c._id.toString(), c.name]),
      );

      const data: ProductWithCategories[] = products.map((product) => ({
         ...product,
         categoryNames: product.categoryIds.map(
            (id) => categoryMap.get(id) ?? 'Sin categoría',
         ),
      }));

      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
   }
}
