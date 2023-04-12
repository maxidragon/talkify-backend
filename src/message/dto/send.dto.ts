import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SendDto {
  @IsInt()
  @IsNotEmpty()
  conversation: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
