import { Request } from 'express';
import { UserEntity } from '../../modules/user/domain/entities/user.entity';

export interface AuthenticatedRequest extends Request {
   user: UserEntity;
}
