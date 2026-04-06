import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

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
   @IsNotEmpty({ message: 'El ID de la orden es obligatorio' })
   orderId: string;
}
