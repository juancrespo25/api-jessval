import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UbigeoNameDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string
}