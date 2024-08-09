import { BadRequestException, Injectable } from "@nestjs/common";
import axios from "axios";
import { axiosErrorHandler } from "src/common/utils/http-resp.utils";
import { CheckCallerID, CheckPhoneDto, validatePhone } from "./dto/phone.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Store } from "./entities/validate.entity";
import { Repository } from "typeorm";
import { UserActiveInterface } from "src/common/interfaces/user-active.interface";
import { Role } from "src/common/enums/rol.enum";
import { UsersService } from "src/users/users.service";
import { CreditsService } from "src/credits/credits.service";
import { SettingsService } from "src/configs/configs.service";
import { LogService } from "src/logs/log.service";

@Injectable()
export class PhoneService {
    private readonly baseUrl = process.env.PHONE_URL
    private readonly key = process.env.PHONE_KEY
    private readonly trestleURL = process.env.TRESTLE_URL
    private readonly trestleKEY = process.env.TRESTLE_KEY


    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        private readonly creditService: CreditsService,
        private readonly moduleService: SettingsService,
        private readonly userService: UsersService,
        private readonly logService: LogService,
    ){}

    async checkUserPhone(phoneNumber: CheckPhoneDto, user: UserActiveInterface) {

        const headers = {
            'Content-type': 'application/json'
        };

        const validateCredits = await this.moduleService.getSettingsByName('check-phone'); // validamos cuantos creditos se necesita
        const userCredits = await this.creditService.getUserCredits(user);
        if(!userCredits.data) throw new BadRequestException(`El usuario no tiene asignado creditos, contactarse con soporte`);

        const creditsUser = userCredits.data['credits'] ?? 0;

        if (userCredits?.data['credits'] < validateCredits?.credits) {
            const msg = `Creditos insuficientes, te faltan: ${validateCredits?.credits - userCredits?.data['credits']} creditos`;
            this.logService.registerLog(msg, 'check-phone', user, creditsUser, creditsUser, 0);
            throw new BadRequestException(msg);
        }

        const exists = await this.checkValidateExists('phone_number', phoneNumber.number);
        if (exists) {
            const newCredits = creditsUser - validateCredits?.credits;
            this.creditService.updateUserCredits(newCredits, user);
            this.logService.registerLog(exists, exists.module, user, creditsUser, newCredits, validateCredits.credits);
            return JSON.parse(exists.data);
        }

        /* si no existe los datos entonces seguimos */
        const axiosPromise = axios.post(`${this.baseUrl}/json/phone/${this.key}/${phoneNumber.number}?country[]=PE`, { headers });
        const resp = await axiosErrorHandler(axiosPromise);

        if (!resp.success) throw new BadRequestException(resp.message);

        const saveStore = {
            phone_number: phoneNumber.number.toString(),
            data: JSON.stringify(resp), // Convertir el objeto resp a una cadena JSON
            credits: validateCredits?.credits,
            userEmail: user.email,
            module: 'check-phone',
            is_admin: user.role == Role.ADMIN
        };

        const newCredits = creditsUser - validateCredits?.credits;
        const save = this.creditService.updateUserCredits(newCredits, user);
        if(!save) {
            const msg = 'Hubo un error al actualizar los creditos';
            this.logService.registerLog(msg, saveStore.module, user, creditsUser, newCredits, creditsUser);
            throw new BadRequestException(msg);
        }

        this.logService.registerLog(resp, 'check-phone', user, creditsUser, newCredits, validateCredits.credits);

        await this.storeRepository.save(saveStore);
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
        console.log(resp);
        return {
            status: response.status,
            data: resp
        };
    }

     async scanUrl(url: { url: string }, user: UserActiveInterface) {
         const strictness = 0;
        const parameters = { strictness: String(strictness) };
        const formattedParameters = new URLSearchParams(parameters).toString();
        const encodedUrl = encodeURIComponent(url.url);

        const validateCredits = await this.moduleService.getSettingsByName('check-url');
        const userCredits = await this.creditService.getUserCredits(user);
        if(!userCredits.data) throw new BadRequestException(`El usuario no tiene asignado creditos, contactarse con soporte`);

        const creditsUser = userCredits.data['credits'] ?? 0;
        const exists = await this.checkValidateExists('url', url.url.toString());

        if (exists) {
            const newCredits = creditsUser - validateCredits?.credits;
            this.logService.registerLog(exists, 'check-url', user, creditsUser, newCredits, validateCredits.credits);
            return JSON.parse(exists.data);
        }

        const apiUrl = `${this.baseUrl}/json/url/${this.key}/${encodedUrl}?${formattedParameters}`;

        const headers = {
            'Content-type': 'application/json'
        };

        const axiosPromise = axios.post(apiUrl, {}, { headers });
        const resp = await axiosErrorHandler(axiosPromise);

        if (!resp.success) throw new BadRequestException(resp.message);

        const saveStore = {
            url: url.url.toString(),
            data: JSON.stringify(resp), // Convertir el objeto resp a una cadena JSON
            credits: validateCredits?.credits,
            userEmail: user.email,
            module: 'check-url',
            is_admin: user.role == Role.ADMIN
        };

        await this.storeRepository.save(saveStore);

        const newCredits = creditsUser - validateCredits?.credits;
        const save = this.creditService.updateUserCredits(newCredits, user);
        if(!save) {
            const msg = 'Hubo un error al actualizar los creditos';
            this.logService.registerLog(msg, saveStore.module, user, creditsUser, newCredits, creditsUser);
            throw new BadRequestException(msg);
        }

        this.logService.registerLog(resp, 'check-url', user, creditsUser, newCredits, validateCredits.credits);

        await this.storeRepository.save(saveStore);
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

    async getHistory (user: UserActiveInterface) {
        return this.storeRepository.find({
            where: {
                userEmail: user.email
            }
        });
    }
}