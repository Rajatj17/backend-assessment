import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

jest.mock('bcrypt');

const userMock = {
  id: 1,
  username: 'test@example.com',
  password: 'correctHashedPassword',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('should create a new user and return success message', async () => {
      const signupDto: SignupDto = {
        username: userMock.username,
        password: userMock.password,
        firstName: userMock.firstName,
        lastName: userMock.lastName,
      };

      const hashedPassword = 'hashedPassword123';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      await authService.signup(signupDto);

      expect(usersService.create).toHaveBeenCalledWith({
        ...signupDto,
        password: hashedPassword,
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if passwords do not match', async () => {
      const loginDto: LoginDto = {
        username: userMock.username,
        password: 'WrongPassword',
      };
  
      jest.spyOn(usersService, 'findOne').mockResolvedValue(userMock);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return an access token if passwords match', async () => {
      const loginDto: LoginDto = {
        username: userMock.username,
        password: userMock.password,
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(userMock);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const jwtSignAsyncSpy = jest.spyOn(jwtService, 'signAsync').mockResolvedValue('accessToken123');

      const result = await authService.login(loginDto);

      expect(jwtSignAsyncSpy).toHaveBeenCalledWith({ sub: userMock.id, username: userMock.username });
      expect(result).toEqual({ access_token: 'accessToken123' });
    });
  });
});
