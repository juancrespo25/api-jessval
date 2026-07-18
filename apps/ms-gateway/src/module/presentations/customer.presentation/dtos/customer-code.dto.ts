import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CustomerCodeDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  code: string;
}
