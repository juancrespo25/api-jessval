import { IsNotEmpty, IsString, Length } from "class-validator";

export class ProvinceStatusDto {
    @IsNotEmpty()
    @IsString()
    @Length(1,1)
    status: string
}