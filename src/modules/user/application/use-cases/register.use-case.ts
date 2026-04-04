import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
   type UserRepository,
   USER_REPOSITORY,
} from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRole } from 'src/shared/enums/user-role.enum';

@Injectable()
export class RegisterUseCase {
   constructor(
      @Inject(USER_REPOSITORY)
      private readonly userRepository: UserRepository,
   ) {}

   async execute(
      data: Pick<UserEntity, 'email' | 'nickName' | 'password'>,
   ): Promise<void> {
      const existing = await this.userRepository.findByEmail(data.email);

      if (existing) throw new BadRequestException('Usuario ya registrado');

      const hashed = await bcrypt.hash(data.password, 10);

      await this.userRepository.save({
         ...data,
         password: hashed,
         token: uuidv4(),
         role: UserRole.CASHIER,
      });
   }
}
