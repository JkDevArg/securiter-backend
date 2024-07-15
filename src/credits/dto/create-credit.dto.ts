import { IsNumber } from "class-validator";

export class CreateCreditDto {

}

export class CharCreditDto {
    @IsNumber()
    id_user: number;

    @IsNumber()
    amount: number;

    @IsNumber()
    id_service: number;
}