import { Injectable } from '@nestjs/common';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credit } from './entities/credit.entity';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

@Injectable()
export class CreditsService {

  constructor(
    @InjectRepository(Credit)
    private readonly creditRepository: Repository<Credit>
  ) { }


  async getUserCredits(email: string) {
    const credit = await this.creditRepository.findOne({
      where: {
        userEmail: email,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      status: 200,
      data: credit
    };
  }

  async updateUserCredits(module: string, credits: number, user: UserActiveInterface) {
    const credit = await this.creditRepository.findOne({
      where: {
        userEmail: user.email,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    // update credits
  }

  create(email: string) {
    return this.creditRepository.create({
        credits: 100,
        userEmail: email
    });
  }

  findAll() {
    return `This action returns all credits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} credit`;
  }

  update(id: number, updateCreditDto: UpdateCreditDto) {
    return `This action updates a #${id} credit`;
  }

  remove(id: number) {
    return `This action removes a #${id} credit`;
  }
}
