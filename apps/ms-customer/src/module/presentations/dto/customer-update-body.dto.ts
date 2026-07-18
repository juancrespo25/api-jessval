import { IsBoolean, IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class CustomerUpdateBodyDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    descripcion: string;

    @IsNotEmpty()
    @IsString()
    @Length(10,10)
    codigo: string;

    @IsNotEmpty()
    @IsString()
    @Length(11,11)
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
    status?: boolean;

    @IsString()
    @MinLength(3)
    user?: string;

    @IsString()
    @MinLength(3)
    password?: string;

    @IsString()
    @Length(10,10)
    userUpdated?: string;
}