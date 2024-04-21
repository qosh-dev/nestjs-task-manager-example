import { Get, HttpStatus, Post, applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import {
  ApiResponseCode,
  ApiResponseModel,
} from '../../../helpers/api.helper';
import { AuthError } from '../auth.common';
import { CurrentUserModel } from '../models/current-user.model';
import { SignInDto } from '../models/dto/sign-in.dto';
import { SignUpDto } from '../models/dto/sign-up.dto';
import { TokenResponse } from '../models/dto/token.response';
import { Authorized } from './authorized.decorator';

export const ApiPostSignUp = () =>
  applyDecorators(
    ApiResponseModel(
      HttpStatus.CREATED,
      'Will return access token',
      TokenResponse,
    ),
    ApiResponseCode(HttpStatus.BAD_REQUEST, AuthError.INVALID_PAYLOAD),
    ApiBody({ type: SignUpDto, required: true }),
    Post('/signup'),
  );

export const ApiPostSignIn = () =>
  applyDecorators(
    ApiResponseModel(
      HttpStatus.OK,
      'Will return access token',
      TokenResponse,
    ),
    ApiResponseCode(HttpStatus.BAD_REQUEST, 'AuthError'),
    ApiResponseCode(HttpStatus.CONFLICT, 'User already exist'),
    ApiResponseCode(HttpStatus.UNAUTHORIZED, AuthError.NOT_AUTHORIZED),
    ApiBody({ type: SignInDto, required: true }),
    Post('/signin'),
  );

export const ApiGetProfile = () =>
  applyDecorators(
    ApiResponseModel(
      HttpStatus.OK,
      'Will return public user data',
      CurrentUserModel,
    ),
    Authorized(),
    Get('profile'),
  );
