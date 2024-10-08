import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CheckPhoneDto {
    @IsNumber()
    number: number;
}

export class CheckCallerID {
    @IsNumber()
    number: number;
}

export class validatePhone {
    @IsString()
    number: string;
}