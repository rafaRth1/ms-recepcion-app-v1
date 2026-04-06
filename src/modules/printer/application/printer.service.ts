import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import net from 'net';
import { CustomerReceipt } from '../../../shared/interfaces/customer-receipt.interface';
import { OrderEntity } from 'src/modules/order/domain/entities/order.entity';
import { ProductType } from 'src/shared/enums/product-type.enum';
import { OrderService } from 'src/modules/order/application/order.service';
import { UserService } from 'src/modules/user/application/user.service';

@Injectable()
export class PrinterService {
   private readonly printerIp: string;
   private readonly printerPort: number;

   constructor(
      private readonly configService: ConfigService,
      private readonly orderService: OrderService,
      private readonly userService: UserService,
   ) {
      this.printerIp =
         this.configService.get<string>('PRINTER_IP') ?? '192.168.1.43';
      this.printerPort = this.configService.get<number>('PRINTER_PORT') ?? 9100;
   }

   async printTicket(order: OrderEntity): Promise<void> {
      const data = this.buildTicketData(order);
      await this.sendToPrinter(data);
   }

   async printCustomerReceipt(orderId: string): Promise<void> {
      const order = await this.orderService.findById(orderId);
      const user = await this.userService.findById(order.userId);

      const receipt: CustomerReceipt = {
         date:
            order.momentaryTime ??
            new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' }),
         customerName: order.nameOrder,
         table: order.nameOrder,
         employee: user.nickName,
         type: order.type,
         items: order.items.map((item) => ({
            description: item.name,
            quantity: 1,
            price: item.price,
            total: item.price,
         })),
         creams: order.items.flatMap((item) => item.creams ?? []),
         total: order.totalPrice,
      };

      const data = this.buildReceiptData(receipt);
      await this.sendToPrinter(data);
   }

   private sendToPrinter(data: string): Promise<void> {
      return new Promise((resolve, reject) => {
         const client = new net.Socket();
         client.setTimeout(5000);

         client.connect(this.printerPort, this.printerIp, () => {
            client.write(Buffer.from(data, 'binary'));
            client.end();
            resolve();
         });

         client.on('error', (err) => {
            reject(
               new InternalServerErrorException(
                  'Error conectando a la impresora: ' + err.message,
               ),
            );
         });

         client.on('timeout', () => {
            client.destroy();
            reject(
               new InternalServerErrorException(
                  'Timeout al conectar a la impresora',
               ),
            );
         });
      });
   }

   private buildTicketData(order: OrderEntity): string {
      const ESC = '\x1B';
      const GS = '\x1D';
      let data = '';

      data += ESC + '@';

      const tipoPedido = this.getTipoPedido(order.type);
      data += ESC + '!' + '\x10';
      data += `*** ${tipoPedido} ***\n`;
      data += ESC + '!' + '\x00';

      data += '==========================================\n';

      data += ESC + 'a' + '\x00';
      data += `Cliente: ${order.nameOrder}\n`;
      data += `Fecha: ${order.momentaryTime ?? '----'}\n`;
      data += `Pago: ${order.paymentType ?? '----'}\n`;
      data += '==========================================\n';

      if (order.exception && order.exception.trim() !== '') {
         data += '\n';
         data += ESC + '!' + '\x10';
         data += '*** NOTA ***\n';
         data += ESC + '!' + '\x00';
         data += `${order.exception}\n`;
      }

      const dishes = order.items.filter((i) => i.type === ProductType.DISH);
      const drinks = order.items.filter((i) => i.type === ProductType.DRINK);

      data += ESC + '!' + '\x10';
      data += 'PLATOS:\n';
      data += ESC + '!' + '\x00';
      data +=
         this.pad('NOMBRE', 20) +
         this.pad('ARR', 5) +
         this.pad('ENS', 5) +
         'PRECIO\n';
      data += '------------------------------------------\n';

      dishes.forEach((dish) => {
         const nameLines = this.wrapText(dish.name, 20);
         data += this.pad(nameLines[0], 20);
         data += this.pad(dish.extras.includes('rice') ? 'Si' : 'No', 5);
         data += this.pad(dish.extras.includes('salad') ? 'Si' : 'No', 5);
         data += `S/${dish.price.toFixed(2)}\n`;

         for (let i = 1; i < nameLines.length; i++) {
            data += this.pad(nameLines[i], 20) + '\n';
         }

         if (dish.creams.length > 0) {
            data += `  Cremas: ${dish.creams.join(', ')}\n`;
         }
      });

      if (drinks.length > 0) {
         data += '\n';
         data += ESC + '!' + '\x10';
         data += 'BEBIDAS:\n';
         data += ESC + '!' + '\x00';
         data += '------------------------------------------\n';
         drinks.forEach((drink) => {
            data += this.pad(drink.name, 30);
            data += `S/${drink.price.toFixed(2)}\n`;
         });
      }

      data += '==========================================\n';
      data += ESC + 'a' + '\x02';
      data += ESC + '!' + '\x10';
      data += `TOTAL: S/${order.totalPrice.toFixed(2)}\n`;
      data += ESC + '!' + '\x00';
      data += '\n\n\n\n\n\n';
      data += GS + 'V' + '\x00';

      return data;
   }

   private buildReceiptData(receipt: CustomerReceipt): string {
      const ESC = '\x1B';
      const GS = '\x1D';
      let data = '';

      data += ESC + '@';

      data += ESC + 'a' + '\x01';
      data += ESC + '!' + '\x18';
      data += 'EZECHIS BURGER\n';
      data += ESC + '!' + '\x00';
      data += '\n';

      data += ESC + 'a' + '\x00';
      data += 'RUC: 10482622670\n';
      data += 'Tel: 924 373 692\n';
      data += 'Sol de Villa Lt 34, Carabayllo 15318\n';
      data += '\n';
      data += `Fecha: ${receipt.date}\n`;

      if (receipt.customerName) {
         data += `Cliente: ${receipt.customerName}\n`;
      }

      data += `Mesa: ${receipt.table}\n`;
      data += `Empleado: ${receipt.employee}\n`;
      data += '----------------------------------------------\n';

      data += this.pad('#', 3) + this.pad('ITEM', 28) + 'IMPORTE\n';
      data += '----------------------------------------------\n';

      receipt.items.forEach((item, index) => {
         data += this.pad((index + 1).toString(), 3);
         data += this.pad(item.description.slice(0, 28), 28);
         data += `${item.total.toFixed(2)}\n`;

         if (item.quantity > 1) {
            data += this.pad('', 3);
            data += `  ${item.quantity} x S/${item.price.toFixed(2)}\n`;
         }
      });

      if (
         receipt.creams &&
         receipt.creams.length > 0 &&
         (receipt.type === 'DELIVERY' || receipt.type === 'PICKUP')
      ) {
         data += '----------------------------------------------\n';
         data += ESC + '!' + '\x10';
         data += 'CREMAS:\n';
         data += ESC + '!' + '\x00';
         data += `${receipt.creams.join(', ')}\n`;
      }

      data += '----------------------------------------------\n';
      data += `CANTIDAD DE ITEMS: ${receipt.items.reduce((sum, item) => sum + item.quantity, 0)}\n`;
      data += '\n';
      data += ESC + '!' + '\x10';
      data += `TOTAL: S/${receipt.total.toFixed(2)}\n`;
      data += ESC + '!' + '\x00';
      data += '----------------------------------------------\n';
      data += '\n';
      data += ESC + 'a' + '\x01';
      data += 'GRACIAS POR SU VISITA!\n';
      data += '\n';
      data += ESC + 'a' + '\x00';
      data += '\n\n\n\n\n\n';
      data += GS + 'V' + '\x00';

      return data;
   }

   private getTipoPedido(type: string): string {
      const tipos: Record<string, string> = {
         TABLE: 'MESA',
         DELIVERY: 'DELIVERY',
         PICKUP: 'PARA LLEVAR',
      };
      return tipos[type] ?? type.toUpperCase();
   }

   private wrapText(text: string, maxLength: number): string[] {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
         if ((currentLine + word).length <= maxLength) {
            currentLine += (currentLine ? ' ' : '') + word;
         } else {
            lines.push(currentLine);
            currentLine = word;
         }
      }

      if (currentLine) lines.push(currentLine);
      return lines;
   }

   private pad(text: string, length: number): string {
      const t = text ?? '';
      if (t.length >= length) return t.slice(0, length);
      return t + ' '.repeat(length - t.length);
   }
}
