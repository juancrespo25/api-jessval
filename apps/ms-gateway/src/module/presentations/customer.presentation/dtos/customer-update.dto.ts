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
  codigo: string;

  @IsNotEmpty()
  @IsString()
  @Length(10,10)
  userUpdated?: string;
}
