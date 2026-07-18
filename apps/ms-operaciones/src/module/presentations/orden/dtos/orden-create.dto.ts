import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type as TransformType, Type } from 'class-transformer';
import { GuiaCreateDTO } from '../../guia/dtos';

export class OrdenCreateDTO {
  @IsNotEmpty()
  @IsNumber()
  numero: number;

  @IsNotEmpty()
  @IsString()
  customer: string;

  @IsNotEmpty()
  @IsString()
  ccosto: string;

  @IsNotEmpty()
  @IsString()
  provincia: string;

  @IsNotEmpty()
  @IsString()
  origen: string;

  @IsNotEmpty()
  @IsString()
  userCreated: string;

  @IsOptional()
  @Type(() => Date)
  fecha_registro?: Date;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @TransformType(() => GuiaCreateDTO)
  guias: GuiaCreateDTO[];
}
