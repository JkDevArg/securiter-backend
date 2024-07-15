import { BadRequestException, Injectable } from "@nestjs/common";
import axios from "axios";
import { axiosErrorHandler } from "src/common/utils/http-resp.utils";
import { CheckCallerID, CheckPhoneDto, validatePhone } from "./dto/phone.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Store } from "./entities/validate.entity";
import { Repository } from "typeorm";
import { UserActiveInterface } from "src/common/interfaces/user-active.interface";
import { Role } from "src/common/enums/rol.enum";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class PhoneService {
    private readonly baseUrl = process.env.PHONE_URL
    private readonly key = process.env.PHONE_KEY
    private readonly trestleURL = process.env.TRESTLE_URL
    private readonly trestleKEY = process.env.TRESTLE_KEY


    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        private readonly userService: UsersService,
    ){}

    async checkUserPhone(phoneNumber: CheckPhoneDto, user: UserActiveInterface) {
        const headers = {
            'Content-type': 'application/json'
        };

        const validateCredits = await this.userService.findByEmailWithCredit(user.email);
        if (validateCredits.credits < 10) throw new BadRequestException(`No tienes suficientes créditos`);

        const exists = await this.checkValidateExists('phone_number', phoneNumber.number);
        if (exists) return { status: 200, data: exists};

        const axiosPromise = axios.post(`${this.baseUrl}/json/phone/${this.key}/${phoneNumber.number}?country[]=PE`, { headers });
        const resp = await axiosErrorHandler(axiosPromise);

        if (!resp.success) throw new BadRequestException(resp.message);

        const saveStore = {
            phone_number: phoneNumber.number.toString(),
            data: JSON.stringify(resp), // Convertir el objeto resp a una cadena JSON
            credits: 10,
            userEmail: user.email,
            module: 'checkUserPhone',
            is_admin: user.role == Role.ADMIN
        };

        await this.storeRepository.save(saveStore);
        await this.userService.updateCreditsWithEmail(user.email, validateCredits.credits - 10);

        return {
            status: 200,
            data: resp
        };
    }

    async checkCallerID(callerId: CheckCallerID) {
        const headers = {
            'Content-type': 'application/json',
            'x-api-key': this.trestleKEY
        };

        const url = `${this.trestleURL}/3.1/caller_id?phone=${callerId.number}&phone.country_hint=PE`;

        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        const resp = await response.json();

        return {
            status: response.status,
            data: resp
        };
    }

    async reversePhone(phoneNumber: CheckPhoneDto) {
        const headers = {
            'Content-type': 'application/json',
            'x-api-key': this.trestleKEY
        };

        const url = `${this.trestleURL}/3.2/phone?phone=${phoneNumber.number}&phone.country_hint=PE`;

        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        const resp = await response.json();

        return {
            status: response.status,
            data: resp
        };
    }

    async phoneValidation(phoneNumber: validatePhone) {
        const headers = {
            'Content-type': 'application/json',
            'x-api-key': this.trestleKEY.toString()
        };

        const url = `${this.trestleURL}/3.0/phone_intel?phone=${phoneNumber.number}&phone.country_hint=PE`;

        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        const resp = await response.json();
        return {
            status: response.status,
            data: resp
        };
    }

    async scanUrl(url: { url: string }) {
        const strictness = 0;
        const parameters = { strictness: String(strictness) };
        const formattedParameters = new URLSearchParams(parameters).toString();
        const encodedUrl = encodeURIComponent(url.url);

        const apiUrl = `${this.baseUrl}/json/url/${this.key}/${encodedUrl}?${formattedParameters}`;

        const headers = {
            'Content-type': 'application/json'
        };

        const axiosPromise = axios.post(apiUrl, {}, { headers });
        const resp = await axiosErrorHandler(axiosPromise);

        return {
            status: 200,
            data: resp
        };
    }

    async checkAccount() {
        const apiUrl = `${this.baseUrl}/json/account/${this.key}`;
        const headers = {
            'Content-type': 'application/json'
        };

        const axiosPromise = axios.post(apiUrl, {}, { headers });
        const resp = await axiosErrorHandler(axiosPromise);

        return {
            status: 200,
            data: resp
        };
    }

    async checkValidateExists(module: string, data: any) {
        const whereCondition = {};
        whereCondition[module] = data;

        return this.storeRepository.findOne({
            where: whereCondition
        });
    }
}