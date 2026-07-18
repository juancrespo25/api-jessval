import { IsBoolean, IsNotEmpty } from "class-validator";

export class ContenidoStatusDto {

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}