import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class DespachoSearchIdDto {

  @IsNumber()
  @Type(() => Number)
  id: number;

}