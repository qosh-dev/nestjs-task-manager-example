import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { ApiGetProfile } from '../decorator/api.decorator';
import { CurrentUser } from '../decorator/current-user.decorator';
import { CurrentUserModel } from '../models/current-user.model';

@ApiTags('Current user')
@Controller('/current-user')
export class CurrentUserController {
  constructor(private authService: AuthService) {}

  @ApiGetProfile()
  async profile(
    @CurrentUser() currentUser: CurrentUserModel,
  ): Promise<CurrentUserModel> {
    return currentUser;
  }
}
