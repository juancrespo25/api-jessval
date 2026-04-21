import { IsNotEmpty, IsString, Length } from "class-validator";

export class UserCodeDTO {
  @IsNotEmpty()
  @IsString()
  @Length(10,10)
  code: string;
}
