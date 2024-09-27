import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ExceptionService {
  throwCustomException(message: string, httpStatus: HttpStatus): void {
    throw new HttpException(message, httpStatus);
  }
}
