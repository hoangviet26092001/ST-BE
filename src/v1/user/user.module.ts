import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ExceptionModule } from 'src/exception/exception.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [ExceptionModule],
})
export class UserModule {}
