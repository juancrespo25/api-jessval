import {
  IsNotEmpty,
  IsString,
  Length
} from "class-validator";

export class CentroCostoUpdateDTO {
  @IsNotEmpty()
  @IsString()
  @Length(10,10)
  code: string;

  @IsNotEmpty()
  @IsString()
  @Length(10,10)
  userUpdated?: string;
}
