import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { GuiaManifiestoCreateDto } from '../../guiamanifiesto/dtos';
import { Type as TransformType } from 'class-transformer';

export class ManifiestoCreateDto {
  @IsNotEmpty()
  @IsString()
  @Length(14, 14)
  codigo: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  zona: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  courier: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  estado: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  userCreated: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @TransformType(() => GuiaManifiestoCreateDto)
  guias: GuiaManifiestoCreateDto[];
}
