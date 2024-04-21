import { applyDecorators, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponseCode } from '../../../helpers/api.helper';
import { AuthError } from '../auth.common';
import { AuthGuard } from './auth.guard';

export function Authorized() {
  return applyDecorators(
    ApiResponseCode(HttpStatus.UNAUTHORIZED, AuthError.NOT_AUTHORIZED),
    ApiBearerAuth('JWT-auth'),
    UseGuards(AuthGuard),
  );
}
