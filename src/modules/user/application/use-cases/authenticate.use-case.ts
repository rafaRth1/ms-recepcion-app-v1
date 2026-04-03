import {
   Inject,
   Injectable,
   NotFoundException,
   ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
   type UserRepository,
   USER_REPOSITORY,
} from '../../domain/repositories/user.repository';

@Injectable()
export class AuthenticateUseCase {
   constructor(
      @Inject(USER_REPOSITORY)
      private readonly userRepository: UserRepository,
      private readonly jwtService: JwtService,
   ) {}

   async execute(email: string, password: string) {
      const user = await this.userRepository.findByEmail(email);
      if (!user) throw new NotFoundException('Usuario no existe');

      const isValid = await user.checkPassword(password);
      if (!isValid)
         throw new ForbiddenException('Email o contraseña inválidos');

      return {
         _id: user._id.toString(),
         nickName: user.nickName,
         email: user.email,
         role: user.role,
         token: this.jwtService.sign({ id: user._id.toString() }),
      };
   }
}
