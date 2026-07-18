import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class EmpresaTransporteStatusDto {

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  @IsNumber()
  tipo_envio: number;
}
