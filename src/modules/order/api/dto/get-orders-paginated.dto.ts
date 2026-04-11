import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentType } from 'src/shared/enums/payment-type.enum';
import { OrderStatus } from 'src/shared/enums/order-status.enum';
import { DeliveryStatus } from 'src/shared/enums/delivery-status.enum';
import { OrderType } from 'src/shared/enums/order-type.enum';

export class GetOrdersPaginatedDto {
   @IsInt()
   @Min(1)
   @Type(() => Number)
   @IsOptional()
   page?: number = 1;

   @IsInt()
   @Min(1)
   @Type(() => Number)
   @IsOptional()
   limit?: number = 10;

   @IsString()
   @IsOptional()
   search?: string;

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

   @IsString()
   @IsOptional()
   startDate?: string;

   @IsString()
   @IsOptional()
   endDate?: string;
}
