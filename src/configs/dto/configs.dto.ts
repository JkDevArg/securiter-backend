import { Optional } from "@nestjs/common";
import { IsNumber, IsString, Max, Min } from "class-validator";

export class ConfigsDto {
    @IsString()
    title: string;

    @IsString()
    @Optional()
    description: string;

    @IsNumber()
    @Min(1)
    @Max(1000)
    credits: number;

    @IsNumber()
    @Optional()
    @Min(1)
    price: number;

    @IsString()
    module: string;

    @IsString()
    assign: string;
}
