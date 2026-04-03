import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
   type UserRepository,
   USER_REPOSITORY,
} from '../../domain/repositories/user.repository';

@Injectable()
export class CheckTokenUseCase {
   constructor(
      @Inject(USER_REPOSITORY)
      private readonly userRepository: UserRepository,
   ) {}

   async execute(token: string): Promise<void> {
      const user = await this.userRepository.findByToken(token);
      if (!user) throw new NotFoundException('Token inválido');
   }
}
