import { Injectable } from "@nestjs/common";
import axios from "axios";
import { axiosErrorHandler } from "src/common/utils/http-resp.utils";
import { CheckPhoneDto } from "./dto/phone.dto";

@Injectable()
export class PhoneService {
    private readonly baseUrl = process.env.PHONE_URL
    private readonly key = process.env.PHONE_KEY

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