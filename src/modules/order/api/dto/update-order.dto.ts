import { Type } from 'class-transformer';
import {
   IsArray,
   IsEnum,
   IsNumber,
   IsOptional,
   IsString,
   ValidateNested,
} from 'class-validator';
import { DeliveryStatus } from 'src/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/shared/enums/order-status.enum';
import { OrderType } from 'src/shared/enums/order-type.enum';
import { PaymentType } from 'src/shared/enums/payment-type.enum';
import { OrderItemDto } from './create-order.dto';

export class UpdateOrderDto {
   @IsString()
   @IsOptional()
   nameOrder?: string;

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => OrderItemDto)
   @IsOptional()
   items?: OrderItemDto[];

   @IsNumber()
   @IsOptional()
   totalPrice?: number;

   @IsString()
   @IsOptional()
   exception?: string;

   @IsString()
   @IsOptional()
   momentaryTime?: string;

   @IsEnum(PaymentType)
   @IsOptional()
   paymentType?: PaymentType;

   @IsEnum(OrderStatus)
   @IsOptional()
   status?: OrderStatus;

   @IsEnum(DeliveryStatus)
   @IsOptional()
   deliveryStatus?: DeliveryStatus;

   @IsEnum(OrderType)
   @IsOptional()
   type?: OrderType;
}
