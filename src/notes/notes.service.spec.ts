import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotesService } from './notes.service';
import { NoteToUser } from './entities/note-to-user.entity';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';

jest.mock('typeorm');

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
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Note),
          useClass: Repository,
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
    it('should create a new note', async () => {
      const createNoteDto: CreateNoteDto = {
        text: 'Test Note',
        // other createNoteDto properties...
      };

      const userId = 1;

      const savedNote = {
        id: 1,
        title: 'Test Note',
        content: 'This is a test note.',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        // other note properties...
      };

      // jest.spyOn(dataSource, 'createQueryRunner').mockReturnValueOnce({
      //   connect: jest.fn(),
      //   startTransaction: jest.fn(),
      //   manager: {
      //     save: jest.fn().mockResolvedValueOnce(savedNote),
      //   },
      //   commitTransaction: jest.fn(),
      //   rollbackTransaction: jest.fn(),
      //   release: jest.fn(),
      // });

      await service.create(createNoteDto, userId);

      expect(dataSource.createQueryRunner).toHaveBeenCalledTimes(1);
      expect(dataSource.createQueryRunner().manager.save).toHaveBeenCalledWith(expect.any(Note));
      expect(dataSource.createQueryRunner().manager.save).toHaveBeenCalledWith(expect.any(NoteToUser));
      expect(dataSource.createQueryRunner().commitTransaction).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if creation fails', async () => {
      const createNoteDto: CreateNoteDto = {
        text: 'Test Note',
      };

      const userId = 1;

      // jest.spyOn(dataSource, 'createQueryRunner').mockReturnValueOnce({
      //   connect: jest.fn(),
      //   startTransaction: jest.fn(),
      //   manager: {
      //     save: jest.fn().mockRejectedValueOnce(new Error('Failed to create a note')),
      //   },
      //   commitTransaction: jest.fn(),
      //   rollbackTransaction: jest.fn(),
      //   release: jest.fn(),
      // });

      await expect(service.create(createNoteDto, userId)).rejects.toThrowError('Failed to create a note');

      expect(dataSource.createQueryRunner).toHaveBeenCalledTimes(1);
      expect(dataSource.createQueryRunner().rollbackTransaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should get all notes for the specified user', async () => {
      const userId = 1;
      const expectedNotes = [
        {
          id: 1,
          title: 'Note 1',
          content: 'Content 1',
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Note 2',
          content: 'Content 2',
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(dataSource.createQueryRunner().manager, 'find').mockResolvedValueOnce(expectedNotes);

      const result = await service.findAll(userId);

      expect(result).toEqual(expectedNotes);
      expect(dataSource.createQueryRunner().manager.find).toHaveBeenCalledWith(NoteToUser, {
        where: { userId },
        relations: { note: true },
      });
    });
  });

  describe('findOne', () => {
    it('should get a specific note', async () => {
      const noteId = 1;
      const expectedNote = {
        id: 1,
        title: 'Note 1',
        content: 'Content 1',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(dataSource.createQueryRunner().manager, 'findOne').mockResolvedValueOnce(expectedNote);

      const result = await service.findOne(noteId);

      expect(result).toEqual(expectedNote);
      expect(dataSource.createQueryRunner().manager.findOne).toHaveBeenCalledWith(Note, { where: { id: noteId } });
    });
  });

  describe('update', () => {
    it('should update a specific note', async () => {
      // const noteId = 1;
      // const updateNoteDto: UpdateNoteDto = {
      //   text: 'Updated Title',
      // };

      // jest.spyOn(dataSource.createQueryRunner().manager, 'update').mockResolvedValueOnce({ affected: 1 });

      // const result = await service.update(noteId, updateNoteDto);

      // expect(result).toEqual({ affected: 1 });
      // expect(dataSource.createQueryRunner().manager.update).toHaveBeenCalledWith(Note, { id: noteId }, updateNoteDto);
    });
  });

  describe('remove', () => {
    it('should remove a specific note', async () => {
      const noteId = 1;
      const expectedEntity = {
        raw: [],
        affected: 1,
        generatedMaps: [],
      };

      jest.spyOn(dataSource.createQueryRunner().manager, 'delete').mockResolvedValueOnce(expectedEntity);

      const result = await service.remove(noteId);

      expect(result).toEqual(expectedEntity);
      expect(dataSource.createQueryRunner().manager.delete).toHaveBeenCalledWith(Note, { id: noteId });
    });
  });
});
