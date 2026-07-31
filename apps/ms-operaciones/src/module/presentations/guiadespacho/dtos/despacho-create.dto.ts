import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class GuiaDespachoCreateDto {
  @IsNotEmpty()
  @IsNumber()
  id_guia: number;

  @IsNotEmpty()
  @IsNumber()
  despacho_id: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  estado: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  userCreated: string;
}
