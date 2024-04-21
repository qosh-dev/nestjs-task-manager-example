import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '../../config/config.service';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthError } from './auth.common';
import { JWTPayload } from './auth.types';
import { SignInDto } from './models/dto/sign-in.dto';
import { SignUpDto } from './models/dto/sign-up.dto';
import { TokenResponse } from './models/dto/token.response';

@Injectable()
export class AuthService {
  constructor(
    public userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signUp(payload: SignUpDto): Promise<TokenResponse> {
    let player = await this.userService.findOneBy({
      username: payload.username,
    });

    if (player) {
      throw new HttpException('User already exist', HttpStatus.CONFLICT);
    }
    let user = await this.userService.findOneBy({ username: payload.username });

    if (user) {
      throw new HttpException(
        AuthError.USER_ALREADY_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    }

    user = await this.userService.create(payload);

    const tokenPayload = this.createTokenPayload(user);
    const token = this.generateJWTToken(tokenPayload);
    return {
      token
    }
  }

  async signIn(payload: SignInDto): Promise<TokenResponse> {
    const user = await this.userService.findOneBy(payload);

    if (!user) {
      throw new UnauthorizedException(AuthError.NOT_AUTHORIZED);
    }

    const isPasswordMatch = await this.comparePassword(
      user.password,
      payload.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException(AuthError.NOT_AUTHORIZED);
    }

    const tokenPayload = this.createTokenPayload(user);
    const token = this.generateJWTToken(tokenPayload);

    return {
      token,
    }
  }

  createTokenPayload(user: UserEntity): JWTPayload {
    return { id: user.id };
  }

  private generateJWTToken(payload: JWTPayload): string {
    return this.jwtService.sign(payload, this.configService.jwtConfig);
  }

  async comparePassword(password: string, withPassword: string) {
    return await bcrypt.compare(withPassword, password);
  }
}
