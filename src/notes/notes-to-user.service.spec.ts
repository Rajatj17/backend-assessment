import { Test, TestingModule } from '@nestjs/testing';
import { NotesToUserService } from './notes-to-user.service';

describe('CheckService', () => {
  let service: NotesToUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesToUserService],
    }).compile();

    service = module.get<NotesToUserService>(NotesToUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
