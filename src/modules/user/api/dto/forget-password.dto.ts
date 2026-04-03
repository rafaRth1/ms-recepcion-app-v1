import { IsEmail } from 'class-validator';

export class ForgetPasswordDto {
   @IsEmail({}, { message: 'Email inválido' })
   email: string;
}
