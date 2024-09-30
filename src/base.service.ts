import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from './prisma/prisma.service';
import * as _ from 'lodash';
import { ICrudOption } from './types/query.interface';

@Injectable()
export class BaseService {
  constructor() {}

  // Success response method
  onSuccess(res: Response, object: any = {}, extras: any = {}) {
    object = object || {};

    res.json({
      statusCode: 200,
      results: Object.assign(
        {
          object,
        },
        extras,
      ),
    });
  }

  // Success response for lists with pagination
  onSuccessAsList<T>(
    res: Response,
    objects: Array<T>,
    extras: any = {},
    option: ICrudOption = {},
  ) {
    const skip = option.skip ?? 0;

    const take = option.take ?? 10;

    const total = objects.length > 0 ? objects.length : 0;

    const page = _.floor(skip / take) + 1;

    res.json({
      statusCode: 200,
      results: Object.assign(
        {
          objects,
        },
        extras,
      ),
      pagination: {
        total,
        currentPage: page,
        nextPage: page + 1,
        prevPage: page - 1,
        limit: option.limit,
      },
    });
  }
}
