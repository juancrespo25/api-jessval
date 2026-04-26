import {IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthLoginDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    user_name: string

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    password: string;
}