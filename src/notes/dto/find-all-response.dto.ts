import { plainToClass } from 'class-transformer';
import { NoteToUser } from '../entities/note-to-user.entity';

export function transformNoteToUserResponse(noteToUsers: NoteToUser | NoteToUser[]): any[] | any {
  if (Array.isArray(noteToUsers)) {
    return noteToUsers.map((noteToUser) =>
      plainToClass(NoteResponseDto, {
        ...noteToUser.note,
        role: noteToUser.role,
      }),
    );
  }

  return plainToClass(NoteResponseDto, {
    ...noteToUsers.note,
    role: noteToUsers.role,
  })
}

class NoteResponseDto {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}
