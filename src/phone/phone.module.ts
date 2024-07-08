import { Module } from '@nestjs/common';
import { PhoneController } from './phone.controller';
import { PhoneService } from './phone.service';

@Module({
  imports: [],
  controllers: [PhoneController],
  providers: [PhoneService],
})
export class PhoneModule {}