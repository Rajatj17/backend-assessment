import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NoteToUser } from './entities/note-to-user.entity';
import { NotesSearchController } from './notes-search.controller';
import { NotesToUserService } from './notes-to-user.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([ Note, NoteToUser ])
  ],
  controllers: [NotesController, NotesSearchController],
  providers: [NotesService, NotesToUserService],
})
export class NotesModule {}
