import { IsEmail, IsString } from 'class-validator';

export class AuthenticateDto {
   @IsEmail({}, { message: 'Email inválido' })
   email: string;

   @IsString({ message: 'La contraseña es obligatoria' })
   password: string;
}
