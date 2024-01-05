import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotesToUserService } from './notes-to-user.service';
import { NoteToUser } from './entities/note-to-user.entity';
import { NotesToUserRole } from './types';

const mockNoteToUser: NoteToUser = {
  noteId: 1,
  userId: 1,
  id: 0,
  role: NotesToUserRole.AUTHOR,
  note: null,
  user: null
}

describe('NotesToUserService', () => {
  let service: NotesToUserService;
  let repo: Repository<NoteToUser>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesToUserService,
        {
          provide: getRepositoryToken(NoteToUser),
          useValue: {
            save: jest.fn().mockResolvedValueOnce(mockNoteToUser),
            findAndCount: jest.fn().mockResolvedValueOnce([[mockNoteToUser], 1]),
            update: jest.fn().mockResolvedValueOnce({ affected: 1 }),
            delete: jest.fn().mockResolvedValueOnce({ affected: 1, raw: [] }),
            count: jest.fn().mockResolvedValueOnce(1)
          },
        },
      ],
    }).compile();

    service = module.get<NotesToUserService>(NotesToUserService);
    repo = module.get<Repository<NoteToUser>>(getRepositoryToken(NoteToUser));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new noteToUser', async () => {
      const result = await service.create(mockNoteToUser.userId, mockNoteToUser.noteId);

      expect(result).toEqual(mockNoteToUser);
    });
  });

  describe('findAll', () => {
    it('should find all notesToUser for a user', async () => {
      const result = await service.findAll(mockNoteToUser.userId);

      expect(result).toEqual([[mockNoteToUser], 1]);
    });
  });

  describe('count', () => {
    it('should count noteToUser based on condition', async () => {
      const result = await service.count({ userId: 1, noteId: 1 });

      expect(result).toEqual(1);
    });
  });

  describe('remove', () => {
    it('should remove noteToUser based on id', async () => {
      const result = await service.remove(1);

      expect(result).toEqual({ affected: 1, raw: [] });
    });
  });
});
