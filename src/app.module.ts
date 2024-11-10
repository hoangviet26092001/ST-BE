import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ExceptionModule } from './exception/exception.module';
import { V1Module } from './v1/v1.module';
import { RouterModule } from '@nestjs/core';
import { TaskModule } from './v1/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    PrismaModule,
    ExceptionModule,
    V1Module,
    TaskModule,
  ],
})
export class AppModule {}
