import { Module } from '@nestjs/common';
import { PhoneController } from './phone.controller';
import { PhoneService } from './phone.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/validate.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Credit } from 'src/credits/entities/credit.entity';
import { CreditsService } from 'src/credits/credits.service';
import { Configs } from 'src/configs/entities/configs.entity';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from 'src/configs/configs.service';
import { LogService } from 'src/logs/log.service';
import { Log } from 'src/logs/entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, User, Credit, Configs, Log])],
  controllers: [PhoneController],
  providers: [PhoneService, UsersService, CreditsService, ConfigService, SettingsService, LogService],
})
export class PhoneModule {}