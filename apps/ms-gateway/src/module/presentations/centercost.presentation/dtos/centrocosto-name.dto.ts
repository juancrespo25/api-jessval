import { IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class CentroCostoNameDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string;

    @IsNotEmpty()
    @IsString()
    @Length(10,10)
    customer: string

}