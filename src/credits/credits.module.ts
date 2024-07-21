import { Module } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/phone/entities/validate.entity';
import { User } from 'src/users/entities/user.entity';
import { Credit } from './entities/credit.entity';
import { UsersService } from 'src/users/users.service';
import { Configs } from 'src/configs/entities/configs.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Store, User, Credit, Configs])],
  controllers: [CreditsController],
  providers: [CreditsService, UsersService, ConfigService],
})
export class CreditsModule {}
