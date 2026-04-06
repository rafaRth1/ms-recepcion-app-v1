import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PrinterService } from '../application/printer.service';
import { PrintTicketDto } from './dto/print-ticket.dto';
import { PrintReceiptDto } from './dto/print-receipt.dto';
import { OrderService } from '../../order/application/order.service';
import { CustomerReceipt } from '../../../shared/interfaces/customer-receipt.interface';
import { JwtGuard } from 'src/shared/guards/jwt.guard';

@Controller('printer')
@UseGuards(JwtGuard)
export class PrinterController {
   constructor(
      private readonly printerService: PrinterService,
      private readonly orderService: OrderService,
   ) {}

   /**
    * @description Imprimir ticket de cocina por ID
    */
   @Post('print')
   async printTicket(
      @Body() dto: PrintTicketDto,
   ): Promise<{ message: string }> {
      const order = await this.orderService.findById(dto.orderId);
      await this.printerService.printTicket(order);
      return { message: 'Ticket enviado a la impresora correctamente' };
   }

   /**
    * @description Imprimir boleta del cliente
    */
   @Post('print-receipt')
   async printReceipt(
      @Body() dto: PrintReceiptDto,
   ): Promise<{ message: string }> {
      await this.printerService.printCustomerReceipt(dto.orderId);
      return { message: 'Boleta enviada a la impresora correctamente' };
   }
}
