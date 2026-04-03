import {
   IsArray,
   IsEnum,
   IsNotEmpty,
   IsNumber,
   IsOptional,
   IsString,
   Min,
   ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReceiptItemDto {
   @IsString()
   @IsNotEmpty()
   description: string;

   @IsNumber()
   @Min(1)
   quantity: number;

   @IsNumber()
   @Min(0)
   price: number;

   @IsNumber()
   @Min(0)
   total: number;
}

export class PrintReceiptDto {
   @IsString()
   @IsNotEmpty({ message: 'La fecha es obligatoria' })
   date: string;

   @IsString()
   @IsOptional()
   customerName?: string;

   @IsString()
   @IsNotEmpty({ message: 'La mesa es obligatoria' })
   table: string;

   @IsString()
   @IsNotEmpty({ message: 'El empleado es obligatorio' })
   employee: string;

   @IsEnum(['TABLE', 'DELIVERY', 'PICKUP'])
   type: 'TABLE' | 'DELIVERY' | 'PICKUP';

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => ReceiptItemDto)
   items: ReceiptItemDto[];

   @IsArray()
   @IsOptional()
   @IsString({ each: true })
   creams?: string[];

   @IsNumber()
   @Min(0)
   total: number;
}
