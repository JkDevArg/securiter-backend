import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from './entities/settings.entity';
import { Credit } from 'src/credits/entities/credit.entity';
import { CreditsService } from 'src/credits/credits.service';

@Module({
  imports: [TypeOrmModule.forFeature([Settings, Credit]), UsersModule,],
  controllers: [AuthController],
  providers: [AuthService, CreditsService],
})
export class AuthModule {}