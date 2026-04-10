import {

  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from "class-validator";

export class CustomerUpdateDTO {
  @IsNotEmpty()
  @IsString()
  @Length(10,10)
  code: string;

  @IsNotEmpty()
  @IsString()
  @Length(10,10)
  userUpdate?: string;
}
