import {
   IsEnum,
   IsNotEmpty,
   IsOptional,
   IsString,
   MaxLength,
} from 'class-validator';
import { Status } from 'src/shared/enums/status.enum';

export class CreateCategoryDto {
   @IsString()
   @IsNotEmpty({ message: 'El nombre es obligatorio' })
   name: string;

   @IsString()
   @IsNotEmpty({ message: 'El slug es obligatorio' })
   slug: string;

   @IsString()
   @IsOptional()
   @MaxLength(500)
   description?: string;

   @IsString()
   @IsOptional()
   icon?: string;

   @IsEnum(Status)
   @IsOptional()
   status?: Status;
}
