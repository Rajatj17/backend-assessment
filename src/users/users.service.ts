import { Injectable } from '@nestjs/common';
import { Repository, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepo.save({
      ...createUserDto
    })
  }

  findAll() {
    return this.userRepo.find()
  }

  findOne(condition: FindOptionsWhere<User>) {
    return this.userRepo.findOneBy(condition)
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.update({
      id
    }, updateUserDto)
  }

  remove(id: number) {
    return this.userRepo.delete({ id })
  }
}
