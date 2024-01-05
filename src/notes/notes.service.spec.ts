import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotesService } from './notes.service';
import { NoteToUser } from './entities/note-to-user.entity';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesToUserRole } from './types';

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
  role: NotesToUserRole.VIEWER,

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
    firstName: 'test',
    lastName: 'user',
    password: ''
  },
};

describe('NotesService', () => {
  let service: NotesService;
  let noteToUserRepo: Repository<NoteToUser>;
  let noteRepo: Repository<Note>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(NoteToUser),
          useValue: {
            save: jest.fn().mockResolvedValueOnce(mockNoteToUser),
            findAndCount: jest.fn().mockResolvedValueOnce([[mockNoteToUser], 1]),
            findOne: jest.fn().mockResolvedValueOnce(mockNoteToUser),
            update: jest.fn().mockResolvedValueOnce({ affected: 1 }),
            delete: jest.fn().mockResolvedValueOnce({ affected: 1, raw: [] }),
            count: jest.fn().mockResolvedValueOnce(1)
          }
        },
        {
          provide: getRepositoryToken(Note),
          useValue: {
            save: jest.fn().mockResolvedValueOnce(note),
            find: jest.fn().mockResolvedValueOnce([note]),
            findOne: jest.fn().mockResolvedValueOnce(note),
            update: jest.fn().mockResolvedValueOnce({ affected: 1 }),
            delete: jest.fn().mockResolvedValueOnce({ affected: 1, raw: [] }),
            count: jest.fn().mockResolvedValueOnce(1)
          }
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              manager: {
                save: jest.fn(),
              },
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    noteToUserRepo = module.get<Repository<NoteToUser>>(getRepositoryToken(NoteToUser));
    noteRepo = module.get<Repository<Note>>(getRepositoryToken(Note));
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw an error if creation fails', async () => {
      const createNoteDto: CreateNoteDto = {
        text: 'Test Note',
      };

      const userId = 1;

      await expect(service.create(createNoteDto, userId)).rejects.toThrowError('Failed to create a note');

      expect(dataSource.createQueryRunner).toHaveBeenCalledTimes(1);
      expect(dataSource.createQueryRunner().rollbackTransaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should get all notes for the specified user', async () => {
      const expectedNotes = [note];

      const result = await service.findAll({});

      expect(result).toEqual(expectedNotes);
    });
  });

  describe('findOne', () => {
    it('should get a specific note', async () => {
      const noteId = 1;
      const expectedNote = note;

      jest.spyOn(noteRepo, 'findOne').mockResolvedValueOnce(expectedNote);

      const result = await service.findOne(noteId);

      expect(result).toEqual(expectedNote);
      expect(noteRepo.findOne).toHaveBeenCalledWith({ where: { id: noteId } });
    });
  });

  describe('update', () => {
    it('should update a specific note', async () => {
      const noteId = 1;
      const updateNoteDto: UpdateNoteDto = {
        text: 'Updated Title',
      };
      const expectedEntity = {
        raw: [],
        affected: 1,
        generatedMaps: [],
      };

      jest.spyOn(noteRepo, 'update').mockResolvedValueOnce(expectedEntity);

      const result = await service.update(noteId, updateNoteDto);

      expect(result).toEqual({ affected: 1 });
      expect(noteRepo.update).toHaveBeenCalledWith({ id: noteId }, updateNoteDto);
    });
  });

  describe('remove', () => {
    it('should remove a specific note', async () => {
      const noteId = 1;
      const expectedEntity = {
        raw: [],
        affected: 1,
      };

      jest.spyOn(noteRepo, 'delete').mockResolvedValueOnce(expectedEntity);

      const result = await service.remove(noteId);

      console.log(result)
      expect(result).toEqual(expectedEntity);
      expect(noteRepo.delete).toHaveBeenCalledWith({ id: noteId });
    });
  });
});
