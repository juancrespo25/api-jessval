import { IsBoolean, IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class CentroCostoUpdateBodyDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    descripcion?: string;

    @IsNotEmpty()
    @IsString()
    @Length(10,10)
    code?: string

    @IsNotEmpty()
    @IsString()
    @Length(10,10)
    cliente?: string;

    @IsNotEmpty()
    @IsBoolean()
    status?: boolean;

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    contacto?: string;

    @IsEmail()
    email?: string

    @IsString()
    telefono?: string;

    @IsString()
    @Length(10,10)
    userUpdated?: string;
}