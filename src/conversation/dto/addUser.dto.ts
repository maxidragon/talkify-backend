import { IsInt, IsNotEmpty } from 'class-validator';

export class AddUserDto {
  @IsInt()
  @IsNotEmpty()
  conversationId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
