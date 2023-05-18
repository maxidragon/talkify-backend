import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  tempId: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
