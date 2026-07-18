import { Type } from "class-transformer";
import { IsNumber, IsString, IsBoolean, IsNotEmpty, Length, IsDate } from "class-validator";

export class DespachoCreateDto {

  @IsNumber()
  @Type(() => Number)
  agente: number;

  @IsNumber()
  @Type(() => Number)
  tipoenvio: number;

  @IsNotEmpty()
  @IsString()
  @Length(11, 11)
  empresatransporte: string;

  @IsNotEmpty()
  @IsString()
  @Length(2,2)
  estado: string;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fecha_creacion: Date;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  userCreated: string;
}
