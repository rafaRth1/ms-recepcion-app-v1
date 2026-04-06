import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ProductEntity } from '../../domain/entities/product.entity';
import { GetProductsPaginatedDto } from '../../api/dto/get-products-paginated.dto';
import { PaginatedResult } from 'src/shared/interfaces/paginated-result.interface';

@Injectable()
export class GetProductsPaginatedUseCase {
   constructor(
      @InjectRepository(ProductEntity)
      private readonly productRepository: MongoRepository<ProductEntity>,
   ) {}

   async execute(
      dto: GetProductsPaginatedDto,
   ): Promise<PaginatedResult<ProductEntity[]>> {
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
      if (categoryId) where['categories._id'] = categoryId;
      if (minPrice !== undefined || maxPrice !== undefined) {
         where.price = {
            ...(minPrice !== undefined && { $gte: minPrice }),
            ...(maxPrice !== undefined && { $lte: maxPrice }),
         };
      }
      if (status) where.status = status;

      const [data, total] = await this.productRepository.findAndCount({
         where,
         skip: (page - 1) * limit,
         take: limit,
         order: { createdAt: 'DESC' },
      });

      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
   }
}
