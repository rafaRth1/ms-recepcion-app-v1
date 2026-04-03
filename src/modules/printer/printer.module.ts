import { Module } from '@nestjs/common';
import { PrinterService } from './application/printer.service';
import { PrinterController } from './api/printer.controller';
import { OrderModule } from '../order/order.module';

@Module({
   imports: [OrderModule],
   controllers: [PrinterController],
   providers: [PrinterService],
})
export class PrinterModule {}
