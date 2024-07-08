import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Role } from '../common/enums/rol.enum';
import { PhoneService } from './phone.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CheckPhoneDto } from './dto/phone.dto';



@Controller('validate')
@UseGuards(AuthGuard)
@Auth(Role.USER)
export class PhoneController {
    constructor(private readonly phoneService: PhoneService) { }

    @Post('check-phone')
    async checkUserPhone(@Body() phone: CheckPhoneDto) {
        return await this.phoneService.checkUserPhone(phone);
    }


    @Post('check-url')
    async checkUrl(@Body() url: { url: string }) {
        return await this.phoneService.scanUrl(url);
    }

    @Auth(Role.ADMIN)
    @Post('check-account')
    async checkAccount() {
        return await this.phoneService.checkAccount();
    }
}
