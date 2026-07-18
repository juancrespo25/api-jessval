import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UbigeoCodeDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  code: string;
}
