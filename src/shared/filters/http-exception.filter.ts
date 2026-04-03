import {
   ArgumentsHost,
   Catch,
   ExceptionFilter,
   HttpException,
   HttpStatus,
   Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
   private readonly logger = new Logger(HttpExceptionFilter.name);

   catch(exception: unknown, host: ArgumentsHost): void {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Ocurrió un error en el proceso';
      let errors: string[] | undefined;

      if (exception instanceof HttpException) {
         status = exception.getStatus();
         const exceptionResponse = exception.getResponse();

         if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
         } else if (typeof exceptionResponse === 'object') {
            const body = exceptionResponse as Record<string, unknown>;
            message = (body['message'] as string) ?? exception.message;

            if (Array.isArray(body['message'])) {
               errors = body['message'] as string[];
               message = 'Error de validación';
            }
         }
      } else {
         this.logger.error(
            `[${request.method}] ${request.url}`,
            exception instanceof Error ? exception.stack : String(exception),
         );
      }

      const body = { code: String(status), message, ...(errors && { errors }) };
      response.status(status).json(body);
   }
}
