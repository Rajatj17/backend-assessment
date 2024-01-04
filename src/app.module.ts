import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { applicationConfig } from 'config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Note } from './notes/entities/note.entity';
import { NoteToUser } from './notes/entities/note-to-user.entity';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: applicationConfig.db.host,
      port: applicationConfig.db.port,
      username: applicationConfig.db.user,
      password: applicationConfig.db.password,
      database: applicationConfig.db.dbName,
      entities: [ User, Note, NoteToUser ],
      synchronize: true,
      logging: true,
    }),
    NotesModule,
    UsersModule,
    AuthModule,
    ThrottlerModule.forRoot([{
      ttl: 60 * 1000,
      limit: 100,
    }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
