import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as _ from 'lodash';
import { ICrudOption } from 'src/types/query.interface';

export const GetOptions = createParamDecorator(
  (key: string | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const { query }: any = request;
    let options: ICrudOption = {};
    const page = parseInt(query['page'] || 1);
    const take = parseInt(query['take'] || 10);
    const skip = parseInt(query['skip']) || (page - 1) * take;
    const select = __parseSelect(query);
    const include = __parseInclude(query);

    const where = _.get(query, 'where')
      ? JSON.parse(_.get(query, 'where'))
      : {};

    const distinct = _.get(query, 'distinct')
      ? JSON.parse(_.get(query, 'distinct'))
      : [];

    const orderBy = _.get(query, 'orderBy')
      ? _.get(query, 'orderBy')
      : {
          createdAt: 'asc',
        };

    options = {
      skip,
      take,
      select,
      include,
      where,
      distinct,
      orderBy,
    };

    return removeEmptyFields(options);
  },
);

/**
 * Converts the 'select' property from a query object into a Prisma-style select object.
 *
 * @param query - The query object containing the 'select' property.
 * @returns An object representing the selected fields with each field set to true.
 * @throws Error if the 'select' property is not a valid JSON string or does not exist.
 */
function __parseSelect(query: { [key: string]: any }): {
  [key: string]: boolean;
} {
  const selectObject: { [key: string]: boolean } = {};

  const rawArray = _.get(query, 'select');

  // Parse the 'select' property if it's a string
  const parsedArray =
    typeof rawArray === 'string' ? JSON.parse(rawArray) : rawArray;

  // Check if parsedArray is an array
  if (Array.isArray(parsedArray)) {
    parsedArray.forEach((field: string) => {
      selectObject[field] = true;
    });
  }

  return selectObject;
}

/**
 * Converts the 'include' property from a query object into a structured include object for Prisma.
 *
 * @param query - The query object containing the 'include' property.
 * @returns An object representing the structured include options for Prisma.
 * @throws Error if 'include' is not a valid object.
 */
function __parseInclude(query: {
  [key: string]: any;
}): { [key: string]: any } | {} {
  if (!_.has(query, 'include')) return {};

  const includeParams = _.get(query, 'include');
  const includeObject: { [key: string]: any } = {};

  Object.keys(includeParams).forEach((key) => {
    const includeArray = includeParams[key];

    includeObject[key] = {
      select: _.get(
        _.find(includeArray, (item) => _.has(item, 'select')),
        'select',
        undefined,
      ),
      where: _.get(
        _.find(includeArray, (item) => _.has(item, 'where')),
        'where',
        undefined,
      ),
      orderBy: _.get(
        _.find(includeArray, (item) => _.has(item, 'orderBy')),
        'orderBy',
        undefined,
      ),
      take: _.toNumber(
        _.get(
          _.find(includeArray, (item) => _.has(item, 'take')),
          'take',
          0,
        ),
      ),
    };
  });

  return includeObject;
}

/**
 * Removes empty objects and arrays from the provided object.
 *
 * @param obj - The object to clean.
 * @returns A new object with empty objects and arrays removed.
 */
function removeEmptyFields(obj: { [key: string]: any }): {
  [key: string]: any;
} {
  return _.transform(obj, (result, value, key) => {
    // Check if the value is an object or array and is not empty
    if (_.isObject(value) && !_.isEmpty(value)) {
      result[key] = _.isArray(value)
        ? _.compact(value)
        : removeEmptyFields(value);
    } else if (!_.isObject(value) || !_.isEmpty(value)) {
      result[key] = value; // Include non-empty values
    }
  });
}
