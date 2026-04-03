export interface CustomerReceiptItem {
   quantity: number;
   description: string;
   price: number;
   total: number;
}

export interface CustomerReceipt {
   date: string;
   customerName?: string;
   table: string;
   employee: string;
   type: 'TABLE' | 'DELIVERY' | 'PICKUP';
   items: CustomerReceiptItem[];
   creams?: string[];
   total: number;
}
