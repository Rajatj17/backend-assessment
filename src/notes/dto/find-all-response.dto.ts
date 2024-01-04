import { plainToClass } from 'class-transformer';
import { NoteToUser } from '../entities/note-to-user.entity';

export function transformNoteToUserResponse(noteToUsers: NoteToUser[]): any[] {
  return noteToUsers.map((noteToUser) =>
    plainToClass(NoteResponseDto, {
      ...noteToUser.note,
      role: noteToUser.role,
    }),
  );
}

class NoteResponseDto {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}
