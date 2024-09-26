import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from './prisma/prisma.service';
import * as _ from 'lodash';

@Injectable()
export class BaseService {
  constructor() {}

  // Success response method
  onSuccess(res: Response, object: any = {}, extras: any = {}) {
    object = object || {};

    res.json({
      code: 200,
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
    option: {
      offset: number;
      limit: number;
      where: any;
    } = {
      offset: 0,
      limit: 10, // Default limit
      where: {},
    },
  ) {
    const total = objects.length > 0 ? objects.length : 0;
    const page = _.floor(option.offset / option.limit) + 1;

    res.json({
      code: 200,
      results: Object.assign(
        {
          objects,
        },
        extras,
      ),
      pagination: {
        total,
        current_page: page,
        next_page: page + 1,
        prev_page: page - 1,
        limit: option.limit,
      },
    });
  }
}
