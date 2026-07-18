import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class LoginDTO{

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    user_name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

}