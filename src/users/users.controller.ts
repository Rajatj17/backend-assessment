import { Controller, Get, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user';
import { ICurrentUser } from 'src/notes/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@CurrentUser() currentUser: ICurrentUser) {
    const user = await this.usersService.findOne({
      id: currentUser.sub,
    });
    if (!user) {
      throw new UnauthorizedException()
    }

    return {
      success: true,
      message: 'Profile Fetched Succesfully!',
      data: {
        user
      }
    }
  }
}
