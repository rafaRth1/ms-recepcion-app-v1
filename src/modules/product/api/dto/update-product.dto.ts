import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';
import { Status } from 'src/shared/enums/status.enum';

export class UpdateProductDto extends PartialType(CreateProductDto) {
   @IsEnum(Status)
   @IsOptional()
   status?: Status;
}
