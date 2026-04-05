import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { GetCategoriesPaginatedDto } from '../../api/dto/get-categories-paginated.dto';
import { PaginatedResult } from 'src/shared/interfaces/paginated-result.interface';

@Injectable()
export class GetCategoriesPaginatedUseCase {
   constructor(
      @InjectRepository(CategoryEntity)
      private readonly categoryRepository: MongoRepository<CategoryEntity>,
   ) {}

   async execute(
      dto: GetCategoriesPaginatedDto,
   ): Promise<PaginatedResult<CategoryEntity[]>> {
      const { page = 1, limit = 10, search, status } = dto;

      const where: Record<string, unknown> = {};

      if (search) {
         where.name = { $regex: search, $options: 'i' };
      }

      if (status) {
         where.status = status;
      }

      const [data, total] = await this.categoryRepository.findAndCount({
         where,
         skip: (page - 1) * limit,
         take: limit,
         order: { createdAt: 'DESC' },
      });

      return {
         data,
         total,
         page,
         limit,
         totalPages: Math.ceil(total / limit),
      };
   }
}
