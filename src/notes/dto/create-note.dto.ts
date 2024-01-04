import { IsNotEmpty } from "class-validator";

export class CreateNoteDto {
  @IsNotEmpty()
  text: string;
}
