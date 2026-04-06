import { Module } from '@nestjs/common';
import { PrinterService } from './application/printer.service';
import { PrinterController } from './api/printer.controller';
import { OrderModule } from '../order/order.module';
import { UserModule } from '../user/user.module';

@Module({
   imports: [OrderModule, UserModule],
   controllers: [PrinterController],
   providers: [PrinterService],
})
export class PrinterModule {}
