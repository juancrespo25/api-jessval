import { IsNotEmpty, IsString, Length } from 'class-validator';

export class GuiaDescargaSearch {
  @IsNotEmpty()
  @IsString()
  @Length(1, 1)
  tipo: string;
}
