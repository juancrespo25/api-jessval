import { IsBoolean, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CustomerCreateDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    descripcion: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(11)
    ruc: string;

    @IsString()
    @MinLength(10)
    direccion: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    ubigeo: string;

    @IsString()
    @MinLength(10)
    contacto?: string;

    @IsEmail()
    email?: string;

    @IsString()
    telefono?: string;

    @IsNotEmpty()
    @IsBoolean()
    activo?: boolean;

    @IsString()
    @MinLength(10)
    userCreated?: string;
}