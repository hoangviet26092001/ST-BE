import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    this.$use(async (params, next) => {
      if (params.model !== 'User') return next(params);

      const result = await next(params);

      if (Array.isArray(result)) {
        return result.map((user) => {
          const { hash, ...userWithoutPassword } = user;

          return userWithoutPassword;
        });
      } else if (result) {
        const { hash, ...userWithoutPassword } = result;

        return userWithoutPassword;
      }
    });

    this.$use(async (params, next) => {
      const before = Date.now();

      const result = await next(params);

      const after = Date.now();

      console.log(
        `Query ${params.model}.${params.action} took ${after - before}ms`,
      );

      return result;
    });
  }
}
