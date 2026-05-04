import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CentroCostoCodeDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  code: string;
}
