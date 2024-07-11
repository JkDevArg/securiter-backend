import { Module } from '@nestjs/common';
import { PhoneController } from './phone.controller';
import { PhoneService } from './phone.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/validate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [PhoneController],
  providers: [PhoneService],
})
export class PhoneModule {}