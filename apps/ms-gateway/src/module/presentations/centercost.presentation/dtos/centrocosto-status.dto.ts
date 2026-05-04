import { IsBoolean, IsOptional } from "class-validator";

export class CentroCostoStatusDTO {
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}