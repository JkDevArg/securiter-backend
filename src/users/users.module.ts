import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Credit } from 'src/credits/entities/credit.entity';
import { Store } from 'src/phone/entities/validate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Credit, Store])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
