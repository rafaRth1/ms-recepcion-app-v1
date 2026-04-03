import {
   Controller,
   Post,
   Get,
   Body,
   Param,
   UseGuards,
   Request,
} from '@nestjs/common';
import { UserService } from '../application/user.service';
import { RegisterDto } from './dto/register.dto';
import { AuthenticateDto } from './dto/authenticate.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { JwtGuard } from '../../../shared/guards/jwt.guard';
import { type AuthenticatedRequest } from 'src/shared/interfaces/authenticated-request.interface';

@Controller('users')
export class UserController {
   constructor(private readonly userService: UserService) {}

   /**
    *
    * @description Crea un nuevo usuario y genera token de confirmación
    */
   @Post('register')
   register(@Body() dto: RegisterDto) {
      return this.userService.register(dto);
   }

   /**
    * @description Valida credenciales y retorna JWT
    */
   @Post('authenticate')
   authenticate(@Body() dto: AuthenticateDto) {
      return this.userService.authenticate(dto.email, dto.password);
   }

   /**
    * @description Confirma la cuenta del usuario via token enviado al email
    */
   @Get('confirm/:token')
   confirm(@Param('token') token: string) {
      return this.userService.confirm(token);
   }

   /**
    * @description Genera nuevo token para restablecer contraseña
    */
   @Post('forget-password')
   forgetPassword(@Body() dto: ForgetPasswordDto) {
      return this.userService.forgetPassword(dto.email);
   }

   /**
    * @description Verifica que el token de recuperación sea válido
    */
   @Get('forget-password/:token')
   checkToken(@Param('token') token: string) {
      return this.userService.checkToken(token);
   }

   /**
    * @description Actualiza la contraseña usando el token de recuperación
    */
   @Post('forget-password/:token')
   newPassword(@Param('token') token: string, @Body() dto: NewPasswordDto) {
      return this.userService.newPassword(token, dto.password);
   }

   /**
    * @description Retorna el perfil del usuario autenticado (requiere JWT)
    */
   @UseGuards(JwtGuard)
   @Get('profile')
   profile(@Request() req: AuthenticatedRequest) {
      return this.userService.profile(req.user.email);
   }
}
