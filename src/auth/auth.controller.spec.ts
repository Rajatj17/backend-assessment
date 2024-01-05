import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

const userData = {
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe@test.com',
  password: 'Password123'
};

const signupResponse = {
  success: true,
  message: "Signup Successfull!"
}

const loginResponse = {
  access_token: 'mock_access_token'
}

jest.mock('src/common/guards/auth.guard');
jest.mock('src/common/guards/throttle.guard');

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(() => (signupResponse)),
            login: jest.fn(() => (loginResponse)),
          }
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService)
  });

  it('should create a new user', async () => {
    expect(await controller.signUp({
      ...userData,
    })).toEqual(signupResponse)
  });

  it('should return the access token', async () => {
    expect(
      await controller.login({
        username: userData.username,
        password: userData.password
      }),
    ).toEqual(loginResponse);
  });
});
