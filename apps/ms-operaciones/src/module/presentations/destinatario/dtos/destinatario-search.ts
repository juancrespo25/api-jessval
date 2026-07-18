import { IsNotEmpty, IsString, Length, MaxLength, Min, MinLength } from "class-validator";

export class DestinatarioSearchDto {

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @Length(10,10)
  customer: string;

  @IsNotEmpty()
  @IsString()
  @Length(10,10)
  ccosto: string;

}