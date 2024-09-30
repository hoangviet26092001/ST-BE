import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '@prisma/client';
import { ICrudOption } from 'src/types/query.interface';

import { CrudController } from 'src/crud.controller';
import { ExceptionService } from 'src/exception/exception.service';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController extends CrudController<UserService, UpdateDto> {
  constructor(
    private readonly userService: UserService,
    private exceptionService: ExceptionService,
  ) {
    super(userService);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response): Promise<void> {
    this.exceptionService.throwCustomException(
      'Access denied',
      HttpStatus.FORBIDDEN,
    );
  }
}
