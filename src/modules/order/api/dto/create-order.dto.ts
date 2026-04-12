import { Type } from 'class-transformer';
import {
   IsArray,
   IsEnum,
   IsNumber,
   IsOptional,
   IsString,
   ValidateNested,
} from 'class-validator';
import { OrderType } from 'src/shared/enums/order-type.enum';
import { PaymentType } from 'src/shared/enums/payment-type.enum';
import { ProductType } from 'src/shared/enums/product-type.enum';

export class OrderItemDto {
   @IsEnum(ProductType)
   type: ProductType;

   @IsString()
   name: string;

   @IsNumber()
   price: number;

   @IsArray()
   @IsString({ each: true })
   @IsOptional()
   extras: string[];

   @IsArray()
   @IsString({ each: true })
   @IsOptional()
   creams: string[];

   @IsOptional()
   chargeDisposable?: boolean;
}

export class CreateOrderDto {
   @IsString()
   nameOrder: string;

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => OrderItemDto)
   items: OrderItemDto[];

   @IsString()
   @IsOptional()
   exception?: string;

   @IsString()
   @IsOptional()
   momentaryTime?: string;

   @IsEnum(PaymentType)
   @IsOptional()
   paymentType?: PaymentType;

   @IsEnum(OrderType)
   type: OrderType;
}
