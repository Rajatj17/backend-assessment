import { Test, TestingModule } from '@nestjs/testing';
import { NotesSearchController } from './notes-search.controller';
import { NotesService } from './notes.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ICurrentUser, NotesToUserRole } from './types';
import { transformSearchToUserResponse } from './dto/search-response.dto';
import { Note } from './entities/note.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';

const mockNotes = [
  {
    id: 1,
    text: 'This is the first note',
    noteToUsers: [
      {
        id: 1,
        noteId: 1,
        userId: 1,
        role: NotesToUserRole.VIEWER,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockResponse: [Note[], number] = [
  mockNotes as Note[],
  1
]

describe('NotesSearchController', () => {
  let controller: NotesSearchController;
  let notesService: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesSearchController],
      providers: [
        NotesService,
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
        JwtModule,
      ],
      imports: [
        JwtModule
      ]
    })
    .compile();

    controller = module.get<NotesSearchController>(NotesSearchController);
    notesService = module.get<NotesService>(NotesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should return notes successfully', async () => {
      // Mock the necessary dependencies and services
      const mockCurrentUser: ICurrentUser = { sub: 1, username: 'testUser' };

      // Mock the AuthGuard
      jest.spyOn(AuthGuard.prototype, 'canActivate').mockReturnValue(Promise.resolve(true));

      jest.spyOn(notesService, 'search').mockResolvedValue(mockResponse);

      // Call the controller method
      const result = await controller.search(mockCurrentUser, 'This', 5, 0);

      // Assert the expected result
      expect(result).toEqual({
        success: true,
        message: 'Notes Fetched Successfully!',
        data: {
          count: mockResponse[1],
          notes: transformSearchToUserResponse(mockResponse[0] as Note[]),
          current_limit: 5,
          current_offset: 0,
        },
      });
    });
  });
});
