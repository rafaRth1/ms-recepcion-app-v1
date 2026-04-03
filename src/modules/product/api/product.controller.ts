import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
   Query,
   UseGuards,
} from '@nestjs/common';
import { ProductService } from '../application/product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from '../domain/entities/product.entity';
import { ProductFilters } from '../domain/repositories/product.repository';
import { JwtGuard } from 'src/shared/guards/jwt.guard';

@Controller('products')
@UseGuards(JwtGuard)
export class ProductController {
   constructor(private readonly productService: ProductService) {}

   /** @description Obtener todos los productos con filtros opcionales */
   @Get()
   findAll(
      @Query('categorySlug') categorySlug?: string,
      @Query('status') status?: string,
      @Query('search') search?: string,
   ): Promise<ProductEntity[]> {
      const filters: ProductFilters = { categorySlug, status, search };
      return this.productService.findAll(filters);
   }

   /** @description Obtener un producto por ID */
   @Get(':id')
   findById(@Param('id') id: string): Promise<ProductEntity> {
      return this.productService.findById(id);
   }

   /** @description Crear un nuevo producto */
   @Post()
   create(@Body() dto: CreateProductDto): Promise<ProductEntity> {
      return this.productService.create(dto);
   }

   /** @description Actualizar un producto por ID */
   @Put(':id')
   update(
      @Param('id') id: string,
      @Body() dto: UpdateProductDto,
   ): Promise<ProductEntity> {
      return this.productService.update(id, dto);
   }

   /** @description Eliminar un producto por ID */
   @Delete(':id')
   async delete(@Param('id') id: string): Promise<void> {
      await this.productService.delete(id);
   }
}
