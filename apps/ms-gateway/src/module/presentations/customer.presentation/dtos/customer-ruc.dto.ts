import { IsNotEmpty, IsString, Length } from "class-validator";

export class CustomerRucDto {
  @IsNotEmpty()
  @IsString()
  @Length(11, 11)
  ruc: string;
}
