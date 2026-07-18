import { IsBoolean, IsNotEmpty } from "class-validator";

export class LineaStatusDto {

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
