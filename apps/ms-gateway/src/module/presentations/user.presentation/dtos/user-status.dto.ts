import { IsBoolean, IsOptional } from "class-validator";

export class UserStatusDTO {
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}