import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { ICurrentUser } from 'src/notes/types';

const currentUser: ICurrentUser = {
  sub: 1,
  username: 'test@example.com',
};

const userData = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  username: 'test@example.com',
  createdAt: new Date,
  updatedAt: new Date,
};

jest.mock('common/guards/auth.guard')

describe('UserController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(() => [userData]),
            create: jest.fn(() => userData),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve(userData),
            ),
            remove: jest.fn(),
            uodate: jest
              .fn()
              .mockImplementation((id: string, user: Partial<User>) =>
                Promise.resolve({
                  firstName: 'John',
                  lastName: 'Doe',
                  email: 'johndoe@test.com',
                  id,
                  ...user,
                }),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService)
  });

  it('should get the current user data', async () => {
    expect(await controller.me(currentUser)).toEqual({
      success: true,
      message: 'Profile Fetched Succesfully!',
      data: {
        user: userData
      }
    });
  });
});
