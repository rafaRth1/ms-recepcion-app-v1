import {
   CallHandler,
   ExecutionContext,
   Injectable,
   NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

interface SuccessResponse<T> {
   code: string;
   message: string;
   data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
   T,
   SuccessResponse<T>
> {
   intercept(
      context: ExecutionContext,
      next: CallHandler<T>,
   ): Observable<SuccessResponse<T>> {
      const response = context.switchToHttp().getResponse<Response>();

      return next.handle().pipe(
         map((data) => ({
            code: String(response.statusCode),
            message: 'Operación exitosa',
            data,
         })),
      );
   }
}
