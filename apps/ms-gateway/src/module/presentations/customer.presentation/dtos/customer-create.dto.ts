import { IsBoolean, IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class CustomerCreateDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    descripcion: string;

    @IsNotEmpty()
    @IsString()
    @Length(11,11)
    ruc: string;

    @IsString()
    @MinLength(10)
    direccion: string;

    @IsNotEmpty()
    @IsString()
    @Length(6,6)
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
    @Length(10,10)
    userCreated?: string;
}