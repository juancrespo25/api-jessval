import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from "class-validator";

export class UserCreateDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    nombres: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    apellidos: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    telefono: string;

    @IsNotEmpty()
    @IsBoolean()
    status: boolean;

    @IsNotEmpty()
    @IsString()
    @Length(10,10)
    area: string;

    @IsOptional()
    @IsString()
    @MinLength(5)
    user_name: string;

    @IsOptional()
    @IsString()
    @MinLength(5)
    password: string;

    @IsNotEmpty()
    @IsString()
    @Length(10,10)
    userCreated: string;
}