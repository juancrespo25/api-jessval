import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type as TransformType } from 'class-transformer';
import { GuiaManifiestoUpdateDto } from '../../guiamanifiesto/dtos';

export class ManifiestoUpdateDto {
  @IsNotEmpty()
  @IsString()
  @Length(14, 14)
  codigo: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  estado: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  userUpdated: Date;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @TransformType(() => GuiaManifiestoUpdateDto)
  guias: GuiaManifiestoUpdateDto[];
}
