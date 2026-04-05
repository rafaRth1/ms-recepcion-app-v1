import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Status } from 'src/shared/enums/status.enum';

export class GetCategoriesPaginatedDto {
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

   @IsEnum(Status)
   @IsOptional()
   status?: Status;
}
