import { IsNotEmpty, IsString, Length } from "class-validator";

export class UserDeleteDTO {

  @IsNotEmpty()
  @IsString()
  @Length(10,10)
  code: string;

  @IsNotEmpty()
  @IsString()
  @Length(10,10)
  userDelete?: string;
}