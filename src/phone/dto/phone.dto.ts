import { IsNumber, MaxLength, MinLength } from "class-validator";

export class CheckPhoneDto {
    @IsNumber()
    number: number;
}
