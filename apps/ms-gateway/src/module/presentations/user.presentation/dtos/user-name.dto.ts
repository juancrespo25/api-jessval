import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserNameDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  user_name: string;
}