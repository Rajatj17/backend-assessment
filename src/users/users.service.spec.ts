import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

jest.mock('typeorm');

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        // other properties...
      };

      const savedUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        // other user properties...
      };

      // jest.spyOn(userRepo, 'save').mockResolvedValueOnce(savedUser);

      const result = await service.create(createUserDto);

      expect(userRepo.save).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(savedUser);
    });
  });

  describe('findAll', () => {
    it('should get all users', async () => {
      const expectedUsers = [
        {
          id: 1,
          username: 'user1',
          email: 'user1@example.com',
          password: 'hashedPassword1',
          createdAt: new Date(),
          updatedAt: new Date(),
          // other user properties...
        },
        {
          id: 2,
          username: 'user2',
          email: 'user2@example.com',
          password: 'hashedPassword2',
          createdAt: new Date(),
          updatedAt: new Date(),
          // other user properties...
        },
      ];

      // jest.spyOn(userRepo, 'find').mockResolvedValueOnce(expectedUsers);

      const result = await service.findAll();

      expect(userRepo.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('findOne', () => {
    it('should get a specific user', async () => {
      // const condition = { username: 'testuser' };

      // const expectedUser = {
      //   id: 1,
      //   username: 'testuser',
      //   email: 'test@example.com',
      //   password: 'hashedPassword',
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      //   // other user properties...
      // };

      // jest.spyOn(userRepo, 'findOneBy').mockResolvedValueOnce(expectedUser);

      // const result = await service.findOne(condition);

      // expect(userRepo.findOneBy).toHaveBeenCalledWith(condition);
      // expect(result).toEqual(expectedUser);
    });
  });

  describe('update', () => {
    it('should update a specific user', async () => {
      // const userId = 1;
      // const updateUserDto: UpdateUserDto = {
      //   username: 'updatedUser',
      //   email: 'updated@example.com',
      //   // other properties...
      // };

      // jest.spyOn(userRepo, 'update').mockResolvedValueOnce({ affected: 1 });

      // const result = await service.update(userId, updateUserDto);

      // expect(userRepo.update).toHaveBeenCalledWith({ id: userId }, updateUserDto);
      // expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should remove a specific user', async () => {
      const userId = 1;
      const expectedEntity = {
        raw: [],
        affected: 1,
        generatedMaps: [],
      };

      jest.spyOn(userRepo, 'delete').mockResolvedValueOnce(expectedEntity);

      const result = await service.remove(userId);

      expect(userRepo.delete).toHaveBeenCalledWith({ id: userId });
      expect(result).toEqual(expectedEntity);
    });
  });
});
