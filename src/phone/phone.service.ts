import { Injectable } from "@nestjs/common";
import axios from "axios";
import { axiosErrorHandler } from "src/common/utils/http-resp.utils";
import { CheckCallerID, CheckPhoneDto, validatePhone } from "./dto/phone.dto";

@Injectable()
export class PhoneService {
    private readonly baseUrl = process.env.PHONE_URL
    private readonly key = process.env.PHONE_KEY
    private readonly trestleURL = process.env.TRESTLE_URL
    private readonly trestleKEY = process.env.TRESTLE_KEY

    async checkUserPhone(phoneNumber: CheckPhoneDto) {
        const headers = {
            'Content-type': 'application/json'
        };

        const axiosPromise = axios.post(`${this.baseUrl}/json/phone/${this.key}/${phoneNumber.number}?country[]=PE`, { headers });
        const resp = await axiosErrorHandler(axiosPromise);

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
            'x-api-key': this.trestleKEY
        };

        const url = `${this.trestleURL}/3.0/phone_intel?phone=${phoneNumber.number}&phone.country_hint=PE`;

        console.log(url)
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

}