import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
// import { errorService } from '@/services'; // Import error handling service
// import { config } from '@/config'; // Import your config
import { PrismaService } from 'src/prisma/prisma.service';
import { ExceptionService } from './exception/exception.service';
import { ICrudOption } from './types/query.interface';
import { BaseService } from './base.service';
import { Response } from 'express';

export interface ICrudExecOption {
  allowNull?: boolean;
}

export interface IModel {
  findMany: (options?: any) => Prisma.PrismaPromise<any>;
  findFirst: (options?: any) => Prisma.PrismaPromise<any>;
  findUnique: (args: any) => Prisma.PrismaPromise<any>;
  count: (args: any) => Prisma.PrismaPromise<any>;
  create: (data: any) => Prisma.PrismaPromise<any>;
  update: (args: any) => Prisma.PrismaPromise<any>;
  delete: (args: any) => Prisma.PrismaPromise<any>;
  deleteMany: (args: any) => Prisma.PrismaPromise<any>;
}

/**
 * A generic CRUD service class that provides basic create, update, and other CRUD functionality.
 * This class is meant to be extended by more specific service classes.
 *
 * @template T - The model type that extends `IModel`. Represents the entity that the service operates on.
 * @template C - The DTO (Data Transfer Object) type for creating new entities.
 * @template U - The DTO type for updating existing entities. Defaults to the same type as `C` if not provided.
 */
export class CrudService<T extends IModel, C, U = C> extends BaseService {
  constructor(model: T) {
    super();
    this.model = model;
  }
  protected model: T;

  exceptionService = new ExceptionService();
  //   Execute method with error handling
  public async exec(
    promise: any,
    option: ICrudExecOption = { allowNull: true },
  ) {
    try {
      const result = await promise;
      if ((result === undefined || result === null) && !option.allowNull)
        throw this.exceptionService.throwCustomException(
          'Result not found',
          HttpStatus.NOT_FOUND,
        );

      return result;
    } catch (error) {
      console.log('⚡⚡⚡ ERROR ==> ', error.message);
      if (error instanceof Error)
        throw this.exceptionService.throwCustomException(
          error.message,
          HttpStatus.NOT_FOUND,
        );
    }
  }

  // Get list of items with pagination and scope
  public async getList(
    res: Response,
    option: ICrudOption = {
      take: 10,
      skip: 0,
    },
  ) {
    const result = await this.exec(this.model.findMany(option));

    return this.onSuccessAsList(res, result, {}, option);
  }

  // Get single item by condition
  public async getItem(res: Response, option: ICrudOption, allowNull = false) {
    const result = await this.exec(
      this.model.findFirst(this.applyFindOptions(option)),
      { allowNull: allowNull },
    );

    return this.onSuccess(res, result);
  }

  // Count total items based on condition
  public async count(option: ICrudOption = {}) {
    return await this.exec(this.model.count({ where: option.where }));
  }

  //   // Create new item
  public async create(res: Response, data: C) {
    return await this.exec(
      this.model.create({
        data,
      }),
    );
  }

  //   // Update existing item by ID
  async update(res: Response, params: U | Partial<U>, option: ICrudOption) {
    await this.exec(
      this.model.findUnique({
        where: option.where,
      }),
      { allowNull: false },
    );

    await this.exec(
      this.model.update({
        where: option.where,
        data: params,
      }),
    );

    return await this.getItem(res, option);
  }

  // Delete item
  async delete(res: Response, option: ICrudOption) {
    const result = await this.exec(
      this.model.delete({
        where: option.where,
      }),
      { allowNull: false },
    );
    return this.onSuccess(res, result);
  }

  //   // Delete multiple items with transaction
  async deleteAll(res: Response, option: ICrudOption) {
    const result = await this.exec(
      this.model.deleteMany({
        where: option.where,
      }),
    );

    return this.onSuccess(res, result);
  }

  // Helper to apply find options (for filtering, ordering, and pagination)
  applyFindOptions(option: ICrudOption = {}) {
    return {
      where: option.filter || option.where,
      skip: option.skip,
      take: option.take,
      orderBy: option.order,
      include: option.include,
    };
  }
}
