import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './domain/entities/user.entity';
import { UserTypeormRepository } from './infrastructure/user.repository.impl';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { AuthenticateUseCase } from './application/use-cases/authenticate.use-case';
import { ConfirmUseCase } from './application/use-cases/confirm.use-case';
import { ForgetPasswordUseCase } from './application/use-cases/forget-password.use-case';
import { CheckTokenUseCase } from './application/use-cases/check-token.use-case';
import { NewPasswordUseCase } from './application/use-cases/new-password.use-case';
import { ProfileUseCase } from './application/use-cases/profile.use-case';
import { UserService } from './application/user.service';
import { UserController } from './api/user.controller';
import { JwtStrategy } from '../../shared/strategies/jwt.strategy';

@Module({
   imports: [
      TypeOrmModule.forFeature([UserEntity]),
      JwtModule.registerAsync({
         imports: [ConfigModule],
         inject: [ConfigService],
         useFactory: (configService: ConfigService) => ({
            secret: configService.getOrThrow<string>('JWT_SECRET'),
            signOptions: {
               expiresIn: configService.getOrThrow('JWT_EXPIRES_IN'),
            },
         }),
      }),
   ],
   providers: [
      {
         provide: USER_REPOSITORY,
         useClass: UserTypeormRepository,
      },
      RegisterUseCase,
      AuthenticateUseCase,
      ConfirmUseCase,
      ForgetPasswordUseCase,
      CheckTokenUseCase,
      NewPasswordUseCase,
      ProfileUseCase,
      UserService,
      JwtStrategy,
   ],
   controllers: [UserController],
   exports: [USER_REPOSITORY, JwtModule],
})
export class UserModule {}
