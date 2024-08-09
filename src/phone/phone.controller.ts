import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Role } from '../common/enums/rol.enum';
import { PhoneService } from './phone.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CheckCallerID, CheckPhoneDto, validatePhone } from './dto/phone.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

@Controller('validate')
@UseGuards(AuthGuard)
@Auth(Role.USER)
export class PhoneController {
    constructor(private readonly phoneService: PhoneService) { }

    @Post('check-phone')
    async checkUserPhone(@Body() phone: CheckPhoneDto, @ActiveUser() user: UserActiveInterface) {
        console.log(user)
        return await this.phoneService.checkUserPhone(phone, user);
    }

    @Post('validate-call')
    async checkCallerID(@Body() phone: CheckCallerID) {
        return await this.phoneService.checkCallerID(phone);
    }

    @Post('reverse-phone')
    async reversePhone(@Body() phone: CheckCallerID) {
        return await this.phoneService.reversePhone(phone);
    }

    @Post('validate-phone')
    async phoneValidation(@Body() phone: validatePhone) {
        return await this.phoneService.phoneValidation(phone);
    }

    @Post('check-url')
    async checkUrl(@Body() url: { url: string }, @ActiveUser() user: UserActiveInterface) {
        return await this.phoneService.scanUrl(url, user);
    }

    @Auth(Role.ADMIN)
    @Post('check-account')
    async checkAccount() {
        return await this.phoneService.checkAccount();
    }

    @Get('user/get-history')
    async getHistory(@ActiveUser() user: UserActiveInterface) {
        return await this.phoneService.getHistory(user);
    }
}
