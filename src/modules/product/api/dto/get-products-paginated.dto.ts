import {
   IsEnum,
   IsInt,
   IsNumber,
   IsOptional,
   IsString,
   Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Status } from 'src/shared/enums/status.enum';

export class GetProductsPaginatedDto {
   @IsInt()
   @Min(1)
   @Type(() => Number)
   @IsOptional()
   page?: number = 1;

   @IsInt()
   @Min(1)
   @Type(() => Number)
   @IsOptional()
   limit?: number = 10;

   @IsString()
   @IsOptional()
   search?: string;

   @IsString()
   @IsOptional()
   categoryId?: string;

   @IsNumber()
   @Min(0)
   @Type(() => Number)
   @IsOptional()
   minPrice?: number;

   @IsNumber()
   @Min(0)
   @Type(() => Number)
   @IsOptional()
   maxPrice?: number;

   @IsEnum(Status)
   @IsOptional()
   status?: Status;
}
