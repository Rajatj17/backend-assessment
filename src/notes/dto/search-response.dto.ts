import { plainToClass } from 'class-transformer';
import { Note } from '../entities/note.entity';

export function transformSearchToUserResponse(notes: Note[]): any[] {
  return notes.map((note) =>
    plainToClass(NoteResponseDto, {
      ...note,
      noteToUsers: undefined
    }),
  );
}

class NoteResponseDto {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}
