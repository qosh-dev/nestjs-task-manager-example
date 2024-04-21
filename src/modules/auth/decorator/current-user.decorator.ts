import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { UserEntity } from 'src/modules/user/user.entity';
import { CurrentUserModel } from '../models/current-user.model';

export function CurrentUser(...keys: (keyof UserEntity)[]) {
  return createParamDecorator((_k, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user as CurrentUserModel;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!keys.length) {
      return user;
    }

    if (Array.isArray(keys)) {
      const obj = {};
      for (const key of keys) {
        obj[key] = user[key];
      }
      return obj;
    }
  })();
}
