import { IsNotEmpty, IsString, Length } from "class-validator";

export class UserNameDTO {
  @IsNotEmpty()
  @IsString()
  @Length(10,10)
  user_name: string;
}