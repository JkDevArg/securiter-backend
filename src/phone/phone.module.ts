import { Module } from '@nestjs/common';
import { PhoneController } from './phone.controller';
import { PhoneService } from './phone.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/validate.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store, User])],
  controllers: [PhoneController],
  providers: [PhoneService, UsersService],
})
export class PhoneModule {}