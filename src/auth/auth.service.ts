import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { HASHING_SALT_ROUND } from 'const';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}
  
  async signup(signupDto: SignupDto) {
    const password = signupDto.password;
    const hashedPassword = await bcrypt.hash(password, HASHING_SALT_ROUND);

    await this.userService.create({
      ...signupDto,
      password: hashedPassword,
    })

    return {
      success: true,
      message: 'Signup Successfull!'
    }
  }

  async login(loginDto: LoginDto) {
    const { username, password } =  loginDto;
    const user = await this.userService.findOne({
      username
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
