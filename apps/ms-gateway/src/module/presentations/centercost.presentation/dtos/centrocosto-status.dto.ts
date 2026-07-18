import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CentroCostoStatusDTO {

  @IsNotEmpty()
  @IsString()
  @Length(10,10)
  customer: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}