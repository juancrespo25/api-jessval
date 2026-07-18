import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class ContenidoUpdateDto {

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsBoolean()
  estado: boolean;
}
