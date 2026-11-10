import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class DespachoUpdateStatusDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  status: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  userUpdated: string;
}
