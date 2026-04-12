import {
   IsArray,
   IsBoolean,
   IsEnum,
   IsNotEmpty,
   IsNumber,
   IsOptional,
   IsString,
   ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType } from 'src/shared/enums/product-type.enum';
import { PaymentType } from 'src/shared/enums/payment-type.enum';
import { OrderType } from 'src/shared/enums/order-type.enum';

export class DirectTicketItemDto {
   @IsEnum(ProductType)
   type: ProductType;

   @IsString()
   @IsNotEmpty()
   name: string;

   @IsNumber()
   price: number;

   @IsArray()
   @IsString({ each: true })
   @IsOptional()
   extras?: string[];

   @IsArray()
   @IsString({ each: true })
   @IsOptional()
   creams?: string[];

   @IsBoolean()
   @IsOptional()
   chargeDisposable?: boolean;
}

export class PrintDirectTicketDto {
   @IsString()
   @IsNotEmpty()
   nameOrder: string;

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => DirectTicketItemDto)
   items: DirectTicketItemDto[];

   @IsNumber()
   totalPrice: number;

   @IsNumber()
   @IsOptional()
   disposableCharge?: number;

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
