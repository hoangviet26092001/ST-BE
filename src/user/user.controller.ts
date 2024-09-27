import {
  Body,
  Controller,
  Delete,
  Get,
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
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { ICrudOption } from 'src/types/query.interface';
import { GetOptions } from 'src/auth/decorator/get-options.decorator';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getList(@Res() res: Response, @GetOptions() options: ICrudOption) {
    return this.userService.getList(res, options);
  }

  @Get(':id')
  getItem(@Param('id') id: string, @Res() res: Response) {
    return this.userService.getItem(res, { where: { id } });
  }

  @Get('getme/me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
    @Res() res: Response,
  ) {
    return this.userService.update(res, updateDto, { where: { id } });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.userService.delete(res, { where: { id } });
  }
}
