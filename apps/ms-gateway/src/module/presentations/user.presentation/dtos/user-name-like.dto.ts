import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserNameLikeDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;
}