import { IsNotEmpty, IsString, Length, MaxLength } from "class-validator";

export class ParentescoCreateDto {


  @IsNotEmpty()
  @IsString()
  @Length(2,2)
  id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  descripcion: string;

}