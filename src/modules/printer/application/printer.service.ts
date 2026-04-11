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
            order.momentaryTime && order.momentaryTime.trim() !== ''
               ? order.momentaryTime
               : new Date().toLocaleString('es-PE', {
                    timeZone: 'America/Lima',
                 }),
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
         client.setTimeout(10000);

         client.connect(this.printerPort, this.printerIp, () => {
            client.write(Buffer.from(data, 'binary'));
            client.end();
            resolve();
         });

         client.on('error', (err) => {
            reject(
               new InternalServerErrorException(
                  `Error conectando a la impresora (${this.printerIp}:${this.printerPort}): ${err.message}`,
               ),
            );
         });

         client.on('timeout', () => {
            client.destroy();
            reject(
               new InternalServerErrorException(
                  `Timeout al conectar a la impresora (${this.printerIp}:${this.printerPort})`,
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
      data += ESC + 'a' + '\x01';
      data += ESC + '!' + '\x18';
      data += `*** ${tipoPedido} ***\n`;
      data += ESC + '!' + '\x00';
      data += ESC + 'a' + '\x00';

      data += '------------------------------------------------\n';
      const fecha =
         order.momentaryTime && order.momentaryTime.trim() !== ''
            ? order.momentaryTime
            : new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });
      data += `Fecha: ${fecha}\n`;
      data += `Cliente: ${order.nameOrder ?? '----'}\n`;
      data += `Pago: ${order.paymentType ?? '----'}\n`;
      data += '------------------------------------------------\n';

      if (order.exception && order.exception.trim() !== '') {
         data += '\n';
         data += ESC + '!' + '\x10';
         data += '*** NOTA ***\n';
         data += ESC + '!' + '\x00';
         data += `${order.exception}\n`;
      }

      const dishes = order.items.filter((i) => i.type === ProductType.DISH);
      const drinks = order.items.filter((i) => i.type === ProductType.DRINK);

      data += '\n';
      data += ESC + '!' + '\x10';
      data += 'PLATOS:\n';
      data += ESC + '!' + '\x00';
      const dishHeader =
         this.pad('NOMBRE', 28) +
         this.pad('ARR', 6) +
         this.pad('ENS', 6) +
         this.pad('PRECIO', 8);
      data += '------------------------------------------------\n';
      data += dishHeader + '\n';
      data += '------------------------------------------------\n';

      dishes.forEach((dish) => {
         const nameLines = this.wrapText(dish.name, 28);
         data += this.pad(nameLines[0], 28);
         data += this.pad(dish.extras.includes('rice') ? 'Si' : 'No', 6);
         data += this.pad(dish.extras.includes('salad') ? 'Si' : 'No', 6);
         data += this.pad(`S/${dish.price.toFixed(2)}`, 8) + '\n';

         for (let i = 1; i < nameLines.length; i++) {
            data += this.pad(nameLines[i], 28) + '\n';
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
         data += '------------------------------------------------\n';
         drinks.forEach((drink) => {
            const nameLines = this.wrapText(drink.name, 34);
            data += this.pad(nameLines[0], 34);
            data += `S/${drink.price.toFixed(2)}\n`;
            for (let i = 1; i < nameLines.length; i++) {
               data += nameLines[i] + '\n';
            }
         });
      }

      data += '------------------------------------------------\n';
      data += ESC + 'a' + '\x01';
      data += ESC + '!' + '\x10';
      data += `TOTAL: S/${order.totalPrice.toFixed(2)}\n`;
      data += ESC + '!' + '\x00';
      data += '\n\n\n\n\n';
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
      data += 'RUC: 10482622670\n';
      data += 'Tel: 924 373 692\n';
      data += 'Sol de Villa Lt 34, Carabayllo\n';
      data += '\n';

      data += '------------------------------------------\n';
      data += '  BOLETA\n';
      data += '------------------------------------------\n';
      data += '\n';
      data += ESC + 'a' + '\x00';
      data += `Fecha: ${receipt.date}\n`;
      if (receipt.customerName) {
         data += `Cliente: ${receipt.customerName}\n`;
      }
      data += `Mesa: ${receipt.table}\n`;
      data += `Empleado: ${receipt.employee}\n`;
      data += '\n';

      const sep = '------------------------------------------------';
      data += sep + '\n';
      const header =
         this.pad('CANT', 6) +
         this.pad('DESCRIPCION', 32) +
         this.pad('IMPORTE', 10);
      data += header + '\n';
      data += sep + '\n';

      receipt.items.forEach((item) => {
         const nameLines = this.wrapText(item.description, 32);
         data += this.pad(String(item.quantity), 6);
         data += this.pad(nameLines[0], 32);
         data += this.pad(`S/${item.total.toFixed(2)}`, 10) + '\n';
         for (let i = 1; i < nameLines.length; i++) {
            data += this.pad('', 6);
            data += nameLines[i] + '\n';
         }
      });

      if (
         receipt.creams &&
         receipt.creams.length > 0 &&
         (receipt.type === 'DELIVERY' || receipt.type === 'PICKUP')
      ) {
         data += sep + '\n';
         data += `Cremas: ${receipt.creams.join(', ')}\n`;
      }

      data += sep + '\n';
      data += '\n';
      data += ESC + 'a' + '\x01';
      data += ESC + '!' + '\x10';
      data += `TOTAL: S/${receipt.total.toFixed(2)}\n`;
      data += ESC + '!' + '\x00';
      data += '\n';
      data += `SON: ${this.numberToWords(receipt.total)}\n`;
      data += '\n';
      data += '* GRACIAS POR SU VISITA! *\n';
      data += '    Vuelva pronto...\n';
      data += '\n\n\n\n\n';
      data += GS + 'V' + '\x00';

      return data;
   }

   private numberToWords(n: number): string {
      const units = [
         '',
         'UNO',
         'DOS',
         'TRES',
         'CUATRO',
         'CINCO',
         'SEIS',
         'SIETE',
         'OCHO',
         'NUEVE',
      ];
      const teens = [
         'DIEZ',
         'ONCE',
         'DOCE',
         'TRECE',
         'CATORCE',
         'QUINCE',
         'DIECISEIS',
         'DIECISIETE',
         'DIECIOCHO',
         'DIECINUEVE',
      ];
      const tens = [
         '',
         'DIEZ',
         'VEINTE',
         'TREINTA',
         'CUARENTA',
         'CINCUENTA',
         'SESENTA',
         'SETENTA',
         'OCHENTA',
         'NOVENTA',
      ];
      const hundreds = [
         '',
         'CIENTO',
         'DOSCIENTOS',
         'TRESCIENTOS',
         'CUATROCIENTOS',
         'QUINIENTOS',
         'SEISCIENTOS',
         'SETECIENTOS',
         'OCHOCIENTOS',
         'NOVECIENTOS',
      ];

      if (n === 0) return 'CERO Y 00/100 SOLES';

      const intPart = Math.floor(n);
      const decPart = Math.round((n - intPart) * 100);

      const toHundreds = (num: number): string => {
         if (num === 0) return '';
         if (num === 100) return 'CIEN';
         let result = '';
         const h = Math.floor(num / 100);
         const rest = num % 100;
         if (h > 0) result += hundreds[h] + ' ';
         if (rest >= 10 && rest <= 19) result += teens[rest - 10];
         else if (rest >= 20 && rest <= 29 && rest !== 20)
            result += 'VEINTI' + units[rest - 20].toLowerCase();
         else if (rest > 0) {
            const t = Math.floor(rest / 10);
            const u = rest % 10;
            result += tens[t];
            if (u > 0) result += ' Y ' + units[u];
         }
         return result.trim();
      };

      let words = '';
      if (intPart >= 1000) {
         const thousands = Math.floor(intPart / 1000);
         words += thousands === 1 ? 'MIL ' : toHundreds(thousands) + ' MIL ';
         const remainder = intPart % 1000;
         if (remainder > 0) words += toHundreds(remainder) + ' ';
      } else {
         words += toHundreds(intPart) + ' ';
      }

      return (
         words.trim() + ' Y ' + String(decPart).padStart(2, '0') + '/100 SOLES'
      );
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
