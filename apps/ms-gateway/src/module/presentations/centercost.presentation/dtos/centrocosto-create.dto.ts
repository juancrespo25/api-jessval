import { IsBoolean, IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class CentroCostoCreateDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    descripcion: string;

    @IsNotEmpty()
    @IsString()
    @Length(10,10)
    cliente: string;

    @IsNotEmpty()
    @IsBoolean()
    status?: boolean;

    @IsString()
    @MinLength(10)
    contacto?: string;

    @IsEmail()
    email?: string;

    @IsString()
    telefono?: string;

    @IsString()
    @MinLength(3)
    user?: string;

    @IsString()
    @MinLength(3)
    password?: string;

    @IsString()
    @Length(10,10)
    userCreated?: string;
}