import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { BaseService } from 'src/base.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { Prisma, User } from '@prisma/client';
import { CrudService } from 'src/crud.service';

@Injectable()
export class UserService extends CrudService<
  Prisma.UserDelegate,
  Omit<User, 'id' & 'createdAt' & 'updatedAt'>
> {
  constructor(private prisma: PrismaService) {
    super(prisma.user);
  }
}
