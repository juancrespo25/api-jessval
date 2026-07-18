import { IsNotEmpty, IsString, Length } from "class-validator";

export class UserTypeDTO {

  @IsString()
  @IsNotEmpty()
  @Length(10,10)
  userType: string;
}