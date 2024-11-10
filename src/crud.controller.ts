import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { CrudService } from './crud.service';
import { ICrudOption } from './types/query.interface';

import { Response } from 'express';
import { GetOptions } from './decorator';

/**
 * A generic CRUD controller class that can be extended by specific controllers
 * to perform standard CRUD operations such as create, update, and delete.
 *
 * @template T - The service class that extends `CrudService`. It handles the core business logic and interacts with the database.
 * @template U - The DTO (Data Transfer Object) type for updates (used in PUT and PATCH methods). Defaults to C if not provided.
 * @template C - The DTO type for creation (used in POST method). Defaults to `unknown` if not provided.
 */
export class CrudController<
  T extends CrudService<any, any>,
  C = unknown,
  U = C,
> {
  constructor(service: T) {
    this.service = service;
  }
  service: T;

  @Post()
  create(@Res() res: Response, @Body() createDTO: C) {
    return this.service.create(res, createDTO);
  }

  @Get()
  getList(@Res() res: Response, @GetOptions() options: ICrudOption) {
    return this.service.getList(res, options);
  }
  @Get(':id')
  getItem(@Param('id') id: string, @Res() res: Response) {
    return this.service.getItem(res, { where: { id } });
  }
  @Put(':id')
  updateAll(
    @Param('id') id: string,
    @Body() updateDto: U,
    @Res() res: Response,
  ) {
    return this.service.update(res, updateDto, { where: { id } });
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: Partial<U>,
    @Res() res: Response,
  ) {
    return this.service.update(res, updateDto, { where: { id } });
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Res() res: Response) {
    return this.service.delete(res, { where: { id } });
  }
  @Delete(':id')
  deleteAll(@Param('id') id: string, @Res() res: Response) {
    return this.service.deleteAll(res, { where: { id } });
  }
}
