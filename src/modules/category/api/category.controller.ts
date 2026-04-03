import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
   UseGuards,
} from '@nestjs/common';
import { CategoryService } from '../application/category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from '../domain/entities/category.entity';
import { JwtGuard } from 'src/shared/guards/jwt.guard';

@Controller('categories')
@UseGuards(JwtGuard)
export class CategoryController {
   constructor(private readonly categoryService: CategoryService) {}

   /**
    *@description Obtener todas las categorías
    * */
   @Get()
   findAll(): Promise<CategoryEntity[]> {
      return this.categoryService.findAll();
   }

   /**
    * @description Obtener una categoría por ID
    * */
   @Get(':id')
   findById(@Param('id') id: string): Promise<CategoryEntity> {
      return this.categoryService.findById(id);
   }

   /**
    * @description Crear una nueva categoría
    * */
   @Post()
   create(@Body() dto: CreateCategoryDto): Promise<CategoryEntity> {
      return this.categoryService.create(dto);
   }

   /**
    * @description Actualizar una categoría por ID
    * */
   @Put(':id')
   update(
      @Param('id') id: string,
      @Body() dto: UpdateCategoryDto,
   ): Promise<CategoryEntity> {
      return this.categoryService.update(id, dto);
   }

   /**
    * @description Eliminar una categoría por ID
    * */
   @Delete(':id')
   async delete(@Param('id') id: string): Promise<void> {
      await this.categoryService.delete(id);
   }
}
