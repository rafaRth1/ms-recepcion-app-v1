import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
   findByEmail(email: string): Promise<UserEntity | null>;
   findByToken(token: string): Promise<UserEntity | null>;
   findById(id: string): Promise<UserEntity | null>;
   save(user: Partial<UserEntity>): Promise<UserEntity>;
   update(id: string, data: Partial<UserEntity>): Promise<void>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';
