import { HttpStatus, Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiResponseCode = (
  status: HttpStatus,
  ...description: string[]
) => {
  return ApiResponse({
    status,
    description: description.join(' | '),
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number'
        },
        message: {
          type: 'string'
        }
      },
      example: {
        statusCode: status,
        message: description[0]
      }
    }
  });
};


export const ApiResponseModel = (
  status: HttpStatus,
  description: string,
  type: Type<unknown> | Function | [Function] | string,
) => {
  return ApiResponse({
    status,
    description,
    type,
  });
};
