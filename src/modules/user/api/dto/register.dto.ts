import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
   @IsEmail({}, { message: 'Email inválido' })
   email: string;

   @IsString({ message: 'El nombre de usuario es obligatorio' })
   nickName: string;

   @IsString()
   @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
   password: string;
}
