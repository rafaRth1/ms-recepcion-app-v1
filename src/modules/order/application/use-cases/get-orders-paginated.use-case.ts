import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { OrderEntity } from '../../domain/entities/order.entity';
import { GetOrdersPaginatedDto } from '../../api/dto/get-orders-paginated.dto';
import { PaginatedResult } from 'src/shared/interfaces/paginated-result.interface';

@Injectable()
export class GetOrdersPaginatedUseCase {
   constructor(
      @InjectRepository(OrderEntity)
      private readonly orderRepository: MongoRepository<OrderEntity>,
   ) {}

   async execute(
      dto: GetOrdersPaginatedDto,
   ): Promise<PaginatedResult<OrderEntity[]>> {
      const {
         page = 1,
         limit = 10,
         search,
         paymentType,
         status,
         deliveryStatus,
         type,
         startDate,
         endDate,
      } = dto;

      const where: Record<string, unknown> = {};

      if (search) where.nameOrder = { $regex: search, $options: 'i' };
      if (paymentType) where.paymentType = paymentType;
      if (status) where.status = status;
      if (deliveryStatus) where.deliveryStatus = deliveryStatus;
      if (type) where.type = type;

      if (startDate || endDate) {
         const createdAtFilter: Record<string, Date> = {};
         if (startDate) {
            createdAtFilter.$gte = new Date(startDate);
         }
         if (endDate) {
            createdAtFilter.$lte = new Date(endDate);
         }
         where.createdAt = createdAtFilter;
      }

      const [data, total] = await this.orderRepository.findAndCount({
         where,
         skip: (page - 1) * limit,
         take: limit,
         order: { createdAt: 'DESC' },
      });

      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
   }
}
