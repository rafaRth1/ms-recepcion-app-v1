import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
   type UserRepository,
   USER_REPOSITORY,
} from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class FindByIdUseCase {
   constructor(
      @Inject(USER_REPOSITORY)
      private readonly userRepository: UserRepository,
   ) {}

   async execute(id: string): Promise<UserEntity> {
      const user = await this.userRepository.findById(id);
      if (!user) throw new NotFoundException('Usuario no encontrado');
      return user;
   }
}
