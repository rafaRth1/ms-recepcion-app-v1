import {
   Body,
   Controller,
   Get,
   Param,
   Post,
   Put,
   UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { OrderService } from '../application/order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from '../domain/entities/order.entity';

@UseGuards(JwtGuard)
@Controller('orders')
export class OrderController {
   constructor(private readonly orderService: OrderService) {}

   /**
    * @description Crea nueva orden
    * */
   @Post()
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
   async findAll(): Promise<OrderEntity[]> {
      return this.orderService.findAll();
   }

   /**
    * @description Obtiene una orden por su id
    * */
   @Get(':id')
   async findById(@Param('id') id: string): Promise<OrderEntity> {
      return this.orderService.findById(id);
   }

   /**
    * @description Actualiza una orden por su id
    * */
   @Put(':id')
   async update(
      @Param('id') id: string,
      @Body() dto: UpdateOrderDto,
   ): Promise<OrderEntity> {
      return this.orderService.update(id, dto);
   }
}
