import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Task, User } from '@prisma/client';
import { CrudService } from 'src/crud.service';

@Injectable()
export class TaskService extends CrudService<
  Prisma.TaskDelegate,
  Omit<Task, 'id'>
> {
  constructor(private prisma: PrismaService) {
    super(prisma.task);
  }
}
