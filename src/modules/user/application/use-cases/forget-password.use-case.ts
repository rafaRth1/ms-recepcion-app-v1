import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
   type UserRepository,
   USER_REPOSITORY,
} from '../../domain/repositories/user.repository';

@Injectable()
export class ForgetPasswordUseCase {
   constructor(
      @Inject(USER_REPOSITORY)
      private readonly userRepository: UserRepository,
   ) {}

   async execute(email: string): Promise<void> {
      const user = await this.userRepository.findByEmail(email);
      if (!user) throw new NotFoundException('Usuario no existe');

      await this.userRepository.update(user._id.toString(), {
         token: uuidv4(),
      });
   }
}
