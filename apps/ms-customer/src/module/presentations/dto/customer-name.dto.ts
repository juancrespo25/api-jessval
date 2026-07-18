import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CustomerNameDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;
}
