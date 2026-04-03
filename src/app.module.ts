import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { PrinterModule } from './modules/printer/printer.module';
import { OrderModule } from './modules/order/order.module';

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
      }),
      DatabaseModule,
      UserModule,
      CategoryModule,
      ProductModule,
      PrinterModule,
      OrderModule,
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
