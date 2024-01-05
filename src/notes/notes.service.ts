import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, DataSource, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { NoteToUser } from './entities/note-to-user.entity';
import { NotesToUserRole } from './types';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private noteRepo: Repository<Note>,
    private dataSource: DataSource,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: number) {
    const note = new Note();
    const noteToUser = new NoteToUser();

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      Object.assign(note, createNoteDto);
      const savedNote = await queryRunner.manager.save(note);

      noteToUser.noteId = savedNote.id;
      noteToUser.userId = userId;
      noteToUser.role = NotesToUserRole.AUTHOR;
      await queryRunner.manager.save(noteToUser);

      await queryRunner.commitTransaction();
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();

      return savedNote;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();

      throw new HttpException('Failed to create a note', HttpStatus.BAD_GATEWAY);
    }
  }

  async findAll(condition: FindOptionsWhere<Note> = {}, take = 30, skip = 0) {
    const notes = await this.noteRepo.find({
      where: condition,
      take,
      skip,
    });

    return notes;
  }

  findOne(id: number) {
    return this.noteRepo.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    const result = await this.noteRepo.update({ id }, updateNoteDto);

    return result;
  }

  async remove(id: number) {
    const entity = await this.noteRepo.delete({ id });

    return entity;
  }

  async search(userId: number, keyword: string, take = 30, skip = 0) {
    const notes = await this.noteRepo
      .createQueryBuilder('note')
      .innerJoinAndSelect(
        'note.noteToUsers',
        'noteToUser',
        'noteToUser.userId = :userId',
        { userId },
      )
      .where('LOWER(note.text) LIKE LOWER(:keyword)', {
        keyword: `%${keyword}%`,
      })
      .take(take)
      .skip(skip)
      .getManyAndCount();

    return notes;
  }

  async count(condition: FindOptionsWhere<Note>) {
    const count = await this.noteRepo.count({
      where: condition
    });

    return count;
  }
}
