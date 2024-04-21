import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard as AuthGuardPassport } from '@nestjs/passport';

export class AuthGuard extends AuthGuardPassport('jwt') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
