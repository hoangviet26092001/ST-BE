import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CrudService } from 'src/crud.service';

@Injectable()
export class UserService extends CrudService<
  Prisma.UserDelegate,
  Omit<User, 'id' & 'hash'>
> {
  constructor(private prisma: PrismaService) {
    super(prisma.user);
  }
}
