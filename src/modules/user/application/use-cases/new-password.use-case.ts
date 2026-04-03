import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
   type UserRepository,
   USER_REPOSITORY,
} from '../../domain/repositories/user.repository';

@Injectable()
export class NewPasswordUseCase {
   constructor(
      @Inject(USER_REPOSITORY)
      private readonly userRepository: UserRepository,
   ) {}

   async execute(token: string, password: string): Promise<void> {
      const user = await this.userRepository.findByToken(token);
      if (!user) throw new NotFoundException('Usuario no existe');

      const hashed = await bcrypt.hash(password, 10);

      await this.userRepository.update(user._id.toString(), {
         password: hashed,
         token: '',
      });
   }
}
