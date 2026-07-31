import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class DespachoSearchDto {


  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fecha_inicial: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fecha_final: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  agente: number;

  @IsOptional()
  @IsString()
  estado: string;

}