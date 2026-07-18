import { IsBoolean, IsNotEmpty } from "class-validator";

export class AgenteStatusDto {

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}