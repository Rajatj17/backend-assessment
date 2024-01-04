import { IsAlphanumeric, IsByteLength, IsNotEmpty } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsByteLength(2)
  username: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @IsByteLength(8)
  password: string;
}
