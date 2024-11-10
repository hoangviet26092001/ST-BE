import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Response } from 'express';

import { CrudController } from 'src/crud.controller';
import { ExceptionService } from 'src/exception/exception.service';
import { JwtGuard } from '../auth/guard';
import { TaskService } from './task.service';
import { UpdateDto } from './dto/update.dto';

@Controller('tasks')
export class TaskController extends CrudController<TaskService, UpdateDto> {
  constructor(
    private readonly taskService: TaskService,
    private exceptionService: ExceptionService,
  ) {
    super(taskService);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response): Promise<void> {
    this.exceptionService.throwCustomException(
      'Access denied',
      HttpStatus.FORBIDDEN,
    );
  }
}
