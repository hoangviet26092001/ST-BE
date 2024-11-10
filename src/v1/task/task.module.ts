import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { ExceptionModule } from 'src/exception/exception.module';
import { TaskController } from './task.controller';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [ExceptionModule],
})
export class TaskModule {}
