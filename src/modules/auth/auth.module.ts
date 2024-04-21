import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import { CurrentUserController } from './controllers/current-user.controller';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ({ jwtConfig }: ConfigService) => ({
        secret: jwtConfig.secret,
        signOptions: {
          expiresIn: jwtConfig.expiresIn,
        },
      }),
    }),
  ],
  controllers: [AuthController, CurrentUserController],
  providers: [AuthService, JwtStrategy, AuthController],
})
export class AuthModule {}
