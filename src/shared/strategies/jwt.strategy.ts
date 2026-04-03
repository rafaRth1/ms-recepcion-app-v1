import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import {
   type UserRepository,
   USER_REPOSITORY,
} from '../../modules/user/domain/repositories/user.repository';

interface JwtPayload {
   id: string;
   iat: number;
   exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor(
      private readonly configService: ConfigService,
      @Inject(USER_REPOSITORY)
      private readonly userRepository: UserRepository,
   ) {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      });
   }

   async validate(payload: JwtPayload) {
      const user = await this.userRepository.findById(payload.id);
      if (!user) throw new UnauthorizedException('Usuario no encontrado');
      return user;
   }
}
