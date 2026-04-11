import {
   Body,
   Controller,
   Get,
   Param,
   Patch,
   Post,
   Put,
   Query,
   UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/shared/enums/user-role.enum';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { OrderService } from '../application/order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetOrdersPaginatedDto } from './dto/get-orders-paginated.dto';
import { OrderEntity } from '../domain/entities/order.entity';
import { PaginatedResult } from 'src/shared/interfaces/paginated-result.interface';

@Controller('orders')
export class OrderController {
   constructor(private readonly orderService: OrderService) {}

   /**
    * @description Obtiene todas las órdenes con paginación y filtros (Admin)
    * */
   @Get('paginated')
   @UseGuards(JwtGuard, RolesGuard)
   @Roles(UserRole.ADMIN)
   async findPaginated(
      @Query() dto: GetOrdersPaginatedDto,
   ): Promise<PaginatedResult<OrderEntity[]>> {
      return this.orderService.findPaginated(dto);
   }

   /**
    * @description Crea nueva orden
    * */
   @Post()
   @UseGuards(JwtGuard)
   async create(
      @Body() dto: CreateOrderDto,
      @CurrentUser('id') userId: string,
   ): Promise<OrderEntity> {
      return this.orderService.create(dto, userId);
   }

   /**
    * @description Obtiene todas las órdenes
    * */
   @Get()
   @UseGuards(JwtGuard)
   async findAll(): Promise<OrderEntity[]> {
      return this.orderService.findAll();
   }

   /**
    * @description Obtiene una orden por su id
    * */
   @Get(':id')
   @UseGuards(JwtGuard)
   async findById(@Param('id') id: string): Promise<OrderEntity> {
      return this.orderService.findById(id);
   }

   /**
    * @description Actualiza una orden por su id
    * */
   @Put(':id')
   @UseGuards(JwtGuard)
   async update(
      @Param('id') id: string,
      @Body() dto: UpdateOrderDto,
   ): Promise<OrderEntity> {
      return this.orderService.update(id, dto);
   }

   /**
    * @description Completa una orden por su id
    * */
   @Patch(':id/complete')
   @UseGuards(JwtGuard)
   async complete(@Param('id') id: string): Promise<OrderEntity> {
      return this.orderService.complete(id);
   }
}
