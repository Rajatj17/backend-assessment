import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';

const userData = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@test.com'
};

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
              Promise.resolve({
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@test.com',
                id,
              }),
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

  it('should get the users', async () => {
    expect(await controller.findAll()).toEqual([userData]);
  });
});
