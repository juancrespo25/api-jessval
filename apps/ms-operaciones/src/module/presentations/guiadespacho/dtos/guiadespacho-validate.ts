import { IsNotEmpty, IsNumber } from "class-validator";

export class GuiaDespachoValidate {

  @IsNotEmpty()
  @IsNumber()
  id_guia: number;

}