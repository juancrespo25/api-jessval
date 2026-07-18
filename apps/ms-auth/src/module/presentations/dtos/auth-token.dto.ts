import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthTokenDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    token: string
}