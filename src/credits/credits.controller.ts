import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from '../common/enums/rol.enum';

@Controller('credits')
@UseGuards(AuthGuard)
@Auth(Role.USER)
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Post()
  create(@ActiveUser() user: UserActiveInterface) {
    return this.creditsService.create(user.email);
  }

  @Get()
  findAll() {
    return this.creditsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreditDto: UpdateCreditDto) {
    return this.creditsService.update(+id, updateCreditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditsService.remove(+id);
  }

  @Get('my-credits/credits')
    getMyCredits(@ActiveUser() user: UserActiveInterface) {
      return this.creditsService.getUserCredits(user);
  }
}
