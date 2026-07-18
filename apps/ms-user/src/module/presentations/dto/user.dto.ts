import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  user_name: string;
}