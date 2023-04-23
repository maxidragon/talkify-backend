import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class EditDto {
  @IsInt()
  message: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
