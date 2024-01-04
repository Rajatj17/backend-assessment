import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ThrottlerCustomGuard } from 'src/common/guards/throttle.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createAuthDto: SignupDto) {
    return this.authService.signup(createAuthDto);
  }

  @UseGuards(ThrottlerCustomGuard)
  @Throttle({ default: { limit: 2, ttl: 5000 } })
  @Post('login')
  login(@Body() createAuthDto: LoginDto) {
    return this.authService.login(createAuthDto);
  }
}
