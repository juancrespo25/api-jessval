import {

  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from "class-validator";

export class CentroCostoUpdateDTO {
  @IsNotEmpty()
  @IsString()
  @Length(10,10)
  code: string;

  @IsNotEmpty()
  @IsString()
  @Length(10,10)
  userDelete?: string;
}
