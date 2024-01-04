import { IsNotEmpty } from "class-validator";

export class ShareNoteDto {
  @IsNotEmpty()
  userId: number;
}
