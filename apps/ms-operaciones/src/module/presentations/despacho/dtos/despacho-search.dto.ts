import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DespachoSearchDto {


  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fecha_inicial: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fecha_final: Date;

  @IsNumber()
  @Type(() => Number)
  agente: number;

  @IsString()
  estado: string;

}