import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SendDto {
  @IsInt()
  @IsNotEmpty()
  receiver: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
