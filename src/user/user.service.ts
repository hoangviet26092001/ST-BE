import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { BaseService } from 'src/base';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class UserService extends BaseService {
  constructor(private prisma: PrismaService) {
    super();
  }
  create(createDto: CreateDto) {
    return 'This action adds a new ';
  }

  async findAll(res: Response, offset = 0, limit = 10) {
    const users = await this.prisma.user.findMany({
      skip: offset,
      take: limit,
    });
    return this.onSuccessAsList<User>(res, users);
  }

  findOne(id: number) {
    return `This action returns a #id `;
  }

  update(id: number, updateDto: UpdateDto) {
    return `This action updates a #id `;
  }

  remove(id: number) {
    return `This action removes a #id `;
  }

  getMe() {
    return 'This action adds a new ';
  }
}
