import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { GuiaDespachoCreateDto } from '../../guiadespacho/dtos';
import { Type as TransformType } from 'class-transformer';

export class DespachoUpdateDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  userUpdated: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  estado: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @TransformType(() => GuiaDespachoCreateDto)
  guias: GuiaDespachoCreateDto[];
}
