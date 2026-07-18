import { IsBoolean, IsOptional } from "class-validator";

export class CustomerStatusDTO {
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}