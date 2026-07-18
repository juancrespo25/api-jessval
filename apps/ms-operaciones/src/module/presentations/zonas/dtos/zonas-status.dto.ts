import { IsBoolean, IsNotEmpty } from "class-validator";

export class ZonasStatusDto {
  @IsNotEmpty()
  @IsBoolean()
  status: boolean
}