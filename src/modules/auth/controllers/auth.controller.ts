import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { ApiPostSignIn, ApiPostSignUp } from '../decorator/api.decorator';
import { SignInDto } from '../models/dto/sign-in.dto';
import { SignUpDto } from '../models/dto/sign-up.dto';
import { TokenResponse } from '../models/dto/token.response';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @ApiPostSignUp()
  async signUp(@Body() dto: SignUpDto): Promise<TokenResponse> {
    return this.service.signUp(dto);
  }

  @ApiPostSignIn()
  async signIn(@Body() body: SignInDto): Promise<TokenResponse>  {
    return  this.service.signIn(body);
  }
}
