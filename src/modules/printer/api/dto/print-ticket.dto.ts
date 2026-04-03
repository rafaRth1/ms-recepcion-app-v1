import { IsNotEmpty, IsString } from 'class-validator';

export class PrintTicketDto {
   @IsString()
   @IsNotEmpty({ message: 'El ID de la orden es obligatorio' })
   orderId: string;
}
