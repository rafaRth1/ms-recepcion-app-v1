import { Injectable } from '@nestjs/common';
import { RegisterUseCase } from './use-cases/register.use-case';
import { AuthenticateUseCase } from './use-cases/authenticate.use-case';
import { ConfirmUseCase } from './use-cases/confirm.use-case';
import { ForgetPasswordUseCase } from './use-cases/forget-password.use-case';
import { CheckTokenUseCase } from './use-cases/check-token.use-case';
import { NewPasswordUseCase } from './use-cases/new-password.use-case';
import { ProfileUseCase } from './use-cases/profile.use-case';
import { UserEntity } from '../domain/entities/user.entity';
import { FindByIdUseCase } from './use-cases/find-by-id.use-case';

@Injectable()
export class UserService {
   constructor(
      private readonly registerUseCase: RegisterUseCase,
      private readonly authenticateUseCase: AuthenticateUseCase,
      private readonly confirmUseCase: ConfirmUseCase,
      private readonly forgetPasswordUseCase: ForgetPasswordUseCase,
      private readonly checkTokenUseCase: CheckTokenUseCase,
      private readonly newPasswordUseCase: NewPasswordUseCase,
      private readonly profileUseCase: ProfileUseCase,
      private readonly findByIdUseCase: FindByIdUseCase,
   ) {}

   register(data: Pick<UserEntity, 'email' | 'nickName' | 'password'>) {
      return this.registerUseCase.execute(data);
   }

   findById(id: string) {
      return this.findByIdUseCase.execute(id);
   }

   authenticate(email: string, password: string) {
      return this.authenticateUseCase.execute(email, password);
   }

   confirm(token: string) {
      return this.confirmUseCase.execute(token);
   }

   forgetPassword(email: string) {
      return this.forgetPasswordUseCase.execute(email);
   }

   checkToken(token: string) {
      return this.checkTokenUseCase.execute(token);
   }

   newPassword(token: string, password: string) {
      return this.newPasswordUseCase.execute(token, password);
   }

   profile(email: string) {
      return this.profileUseCase.execute(email);
   }
}
