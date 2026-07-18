import { IsNotEmpty, IsNumber } from "class-validator";

export class GuiaValidate {
  @IsNotEmpty()
  @IsNumber()
  id_guia: number;
}

