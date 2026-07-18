import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UbigeoNameDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;
}
