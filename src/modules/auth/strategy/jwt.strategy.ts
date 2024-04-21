import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../../config/config.service';
import { UserService } from '../../user/user.service';
import { AuthError } from '../auth.common';
import { JWTStrategyValidatePayload } from '../auth.types';
import { CurrentUserModel } from '../models/current-user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    readonly configService: ConfigService,
    readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtConfig.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JWTStrategyValidatePayload) {
    const user = await this.userService.findOneBy({ id: payload.id });
    if (!user) {
      throw new UnauthorizedException(AuthError.NOT_AUTHORIZED);
    }
    return plainToInstance(
      CurrentUserModel,
      user,
      {
        enableCircularCheck: true,
        excludeExtraneousValues: true,
      },
    );
  }
}
