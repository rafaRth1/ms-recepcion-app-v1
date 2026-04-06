import {
   IsArray,
   IsNotEmpty,
   IsNumber,
   IsOptional,
   IsString,
   Min,
   Max,
   ArrayNotEmpty,
   IsEnum,
} from 'class-validator';
import { ProductType } from 'src/shared/enums/product-type.enum';

export class CreateProductDto {
   @IsString()
   @IsNotEmpty({ message: 'El nombre es obligatorio' })
   name: string;

   @IsNumber()
   @Min(0, { message: 'El precio no puede ser negativo' })
   price: number;

   @IsNumber()
   @IsOptional()
   @Min(0, { message: 'El descuento no puede ser negativo' })
   @Max(100, { message: 'El descuento no puede ser mayor a 100' })
   discount?: number;

   @IsString()
   @IsOptional()
   image?: string;

   @IsEnum(ProductType)
   type: ProductType;

   @IsString()
   @IsOptional()
   description?: string;

   @IsArray()
   @IsOptional()
   @IsString({ each: true })
   ingredients?: string[];

   @IsArray()
   @IsOptional()
   @IsString({ each: true })
   tags?: string[];

   @IsArray()
   @ArrayNotEmpty({ message: 'Debe tener al menos una categoría' })
   @IsString({ each: true })
   categoryIds: string[];
}
