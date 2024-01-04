import { Test, TestingModule } from '@nestjs/testing';

import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { ICurrentUser } from './types';


const currentUser: ICurrentUser = {
  sub: 1,
  email: 'test@example.com',
};

const note = {
  id: 1,
  text: 'Test Note',
  userId: currentUser.sub,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const updatedNote = {
  ...note,
  text: 'Updated Note'
};

jest.mock('./notes.service');
jest.mock('../auth/gaurds/auth.guard');

describe('NotesController', () => {
  let controller: NotesController;
  let notesService: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [NotesService],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    notesService = module.get<NotesService>(NotesService);
  });

  describe('create', () => {
    it('should create a new note', async () => {
      const createNoteDto: CreateNoteDto = {
        text: 'Some random text'
      };

      jest.spyOn(notesService, 'create').mockImplementation((arg1, arg2) => Promise.resolve(note));

      const result = await controller.create(currentUser, createNoteDto);

      expect(notesService.create).toHaveBeenCalledWith(createNoteDto, currentUser.sub);
      expect(result).toEqual({
        success: true,
        message: 'Note successfully created!',
        data: {
          note: result
        }
      });
    });
  });

  describe('findAll', () => {
    it('should get all notes for the current user', async () => {
      // const currentUser: ICurrentUser = {
      //   sub: 1,
      //   email: 'test@example.com',
      // };

      // jest.spyOn(notesService, 'findAll').mockResolvedValueOnce([note]);

      // await controller.findAll(currentUser);

      // expect(notesService.findAll).toHaveBeenCalledWith(currentUser.sub);
    });
  });

  describe('findOne', () => {
    it('should get a specific note', async () => {
      const noteId = '1';

      jest.spyOn(notesService, 'findOne').mockResolvedValueOnce(note);

      await controller.findOne(noteId);

      expect(notesService.findOne).toHaveBeenCalledWith(+noteId);
    });
  });

  describe('update', () => {
    it('should update a specific note', async () => {
      // const noteId = '1';
      // const updateNoteDto: UpdateNoteDto = {
      //   text: 'updated text'
      // };

      // jest.spyOn(notesService, 'update').mockResolvedValueOnce(updatedNote);

      // await controller.update(noteId, updateNoteDto);

      // expect(notesService.update).toHaveBeenCalledWith(+noteId, updateNoteDto);
    });
  });

  describe('remove', () => {
    it('should remove a specific note', async () => {
      // const noteId = '1';

      // jest.spyOn(notesService, 'remove').mockResolvedValueOnce(/* mock your expected return value */);

      // await controller.remove(noteId);

      // expect(notesService.remove).toHaveBeenCalledWith(+noteId);
    });
  });
});
