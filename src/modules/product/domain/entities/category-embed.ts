import { Column } from 'typeorm';

export class CategoryEmbed {
   @Column()
   _id: string;

   @Column()
   name: string;

   @Column()
   slug: string;
}
