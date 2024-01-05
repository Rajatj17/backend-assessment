import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { NoteToUser } from './entities/note-to-user.entity';
import { NotesToUserRole } from './types';

@Injectable()
export class NotesToUserService {
  constructor(
    @InjectRepository(NoteToUser)
    private noteToUserRepo: Repository<NoteToUser>,
  ) {}

  async create(
    userId: number,
    noteId: number,
    role: NotesToUserRole = NotesToUserRole.VIEWER,
  ) {
    const noteToUser = new NoteToUser();
    noteToUser.noteId = noteId;
    noteToUser.userId = userId;
    noteToUser.role = role;

    await this.noteToUserRepo.save(noteToUser);
  }

  async findAll(userId: number, take = 30, skip = 0) {
    const notes = await this.noteToUserRepo.findAndCount({
      where: {
        userId,
      },
      relations: {
        note: true,
      },
      take,
      skip,
    });

    return notes;
  }

  findOne(condition: FindOptionsWhere<NoteToUser>) {
    return this.noteToUserRepo.findOne({
      where: condition,
    });
  }

  update(id: number, updateNoteDto: { userId: number; noteId: number }) {
    return this.noteToUserRepo.update({ id }, updateNoteDto);
  }

  async remove(id: number) {
    const entity = await this.noteToUserRepo.delete({ id });

    return entity;
  }

  count(condition: FindOptionsWhere<NoteToUser>) {
    return this.noteToUserRepo.count({
      where: condition,
    });
  }
}
