import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
   type UserRepository,
   USER_REPOSITORY,
} from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class ProfileUseCase {
   constructor(
      @Inject(USER_REPOSITORY)
      private readonly userRepository: UserRepository,
   ) {}

   async execute(
      email: string,
   ): Promise<Omit<UserEntity, 'password' | 'token' | 'checkPassword'>> {
      const user = await this.userRepository.findByEmail(email);
      if (!user) throw new NotFoundException('Usuario no existe');

      return {
         _id: user._id,
         email: user.email,
         role: user.role,
         nickName: user.nickName,
         createdAt: user.createdAt,
         updatedAt: user.updatedAt,
      };
   }
}
