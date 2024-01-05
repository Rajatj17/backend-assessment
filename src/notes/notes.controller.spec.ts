import { Test, TestingModule } from '@nestjs/testing';

import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { ICurrentUser, NotesToUserRole } from './types';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesToUserService } from './notes-to-user.service';
import { UsersService } from 'src/users/users.service';
import { Note } from './entities/note.entity';
import { NoteToUser } from './entities/note-to-user.entity';
import { transformNoteToUserResponse } from './dto/find-all-response.dto';
import { ForbiddenException } from '@nestjs/common';

const currentUser: ICurrentUser = {
  sub: 1,
  username: 'test@example.com',
};

const note = {
  id: 1,
  text: 'Test Note',
  noteToUsers:  [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockNoteToUser: NoteToUser = {
  id: 1,
  noteId: 1,
  userId: 1,
  role: NotesToUserRole.VIEWER, // Adjust as needed

  // Mocked associated entities
  note: {
    id: 1,
    text: 'Sample Note Text',
    createdAt: new Date(),
    updatedAt: new Date(),
    noteToUsers: []
  },
  user: {
    id: 1,
    username: 'sampleUser',
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: '',
    lastName: '',
    password: ''
  },
};

jest.mock('./notes.service');
jest.mock('./notes-to-user.service');
jest.mock('../users/users.service');

jest.mock('src/common/guards/auth.guard');
jest.mock('src/common/guards/throttle.guard')

describe('NotesController', () => {
  let controller: NotesController;
  let notesService: NotesService;
  let notesToUserService: NotesToUserService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [NotesService, NotesToUserService, UsersService],
    })
    .compile();

    controller = module.get<NotesController>(NotesController);
    notesService = module.get<NotesService>(NotesService);
    notesToUserService = module.get<NotesToUserService>(NotesToUserService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a note successfully', async () => {
      const createNoteDto: CreateNoteDto = {
        text: 'Test Note'
      };
      // Mock dependencies and services
      jest.spyOn(notesService, 'create').mockResolvedValue(note as Note);

      // Call the controller method
      const result = await controller.create(currentUser, createNoteDto);

      // Assert the expected result
      expect(result).toEqual({
        success: true,
        message: 'Note successfully created!',
        data: {
          note,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return notes list successfully', async () => {
      jest.spyOn(notesToUserService, 'findAll').mockResolvedValue([[mockNoteToUser], 1]);

      // Call the controller method
      const result = await controller.findAll(currentUser, 5, 0);

      // Assert the expected result
      expect(result).toEqual({
        success: true,
        message: 'Notes list!',
        data: {
          count: 1,
          notes: transformNoteToUserResponse([mockNoteToUser]),
          current_limit: 5,
          current_offset: 0,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should get a specific note', async () => {
      const noteId = '1';

      jest.spyOn(notesToUserService, 'count').mockResolvedValue(1);
      jest.spyOn(notesService, 'findOne').mockResolvedValueOnce(note);

      const result = await controller.findOne(currentUser, noteId);

      // Assert the expected result
      expect(result).toEqual({
        success: true,
        message: 'Note Found Successfully!',
        data: {
          note,
        },
      });
    });
  });

  describe('update', () => {
    it('should update a specific note', async () => {
      const noteId = '1';
      const updateNoteDto: UpdateNoteDto = {
        text: 'updated text'
      };

      jest.spyOn(notesToUserService, 'count').mockResolvedValue(1);
      jest.spyOn(notesService, 'update').mockResolvedValue({
        affected: 1,
        raw: '',
        generatedMaps: []
      });

      await expect(controller.update(currentUser, noteId, updateNoteDto)).resolves.toEqual({
        success: true,
        message: 'Note Updated Successfully!',
        data: {},
      });

      expect(notesService.update).toHaveBeenCalledWith(+noteId, updateNoteDto);
    });
  });

  describe('remove', () => {
    it('should remove a specific note', async () => {
      const noteId = '1';

      jest.spyOn(notesToUserService, 'count').mockResolvedValue(1);
      jest.spyOn(notesService, 'remove').mockResolvedValueOnce({
        raw: '',
        affected: 1
      });

      await expect(controller.remove(currentUser, noteId)).resolves.toEqual({
        success: true,
        message: 'Note Deleted Successfully!',
        data: {},
      });

      expect(notesService.remove).toHaveBeenCalledWith(+noteId);
    });

    it('should throw ForbiddenException if the user does not have the role AUTHOR', async () => {
      const currentUser = { sub: 1, username: 'testUser' };
      const noteId = '1';
      const updateNoteDto: UpdateNoteDto = {
        text: 'updated text',
      };

      jest.spyOn(notesToUserService, 'count').mockResolvedValue(0);

      await expect(controller.update(currentUser, noteId, updateNoteDto)).rejects.toThrowError(
        ForbiddenException,
      );

      expect(notesService.update).not.toHaveBeenCalled();
    });
  });
});
