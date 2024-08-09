import { Injectable } from '@nestjs/common';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credit } from './entities/credit.entity';
import { UserActiveInterface } from "src/common/interfaces/user-active.interface";

@Injectable()
export class CreditsService {

  constructor(
    @InjectRepository(Credit)
    private readonly creditRepository: Repository<Credit>
  ) { }


  async getUserCredits(user: UserActiveInterface) {
    const credit = await this.creditRepository.findOne({
      where: {
        userEmail: user.email,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!credit) {
      return {
        status: 404,
        message: 'No credits found for the user',
        data: null,
      };
    }

    const credits = credit.credits || 0;

    return {
      status: 200,
      data: {
        credits
      },
    };
  }

  async updateUserCredits(credits: number, user: UserActiveInterface) {
    const credit = await this.creditRepository.findOne({
      where: {
        userEmail: user.email,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    // update credits
    if(!credits) return false;
    credit.credits = credits;
    return await this.creditRepository.save(credit);
  }

  create(email: string) {
    const credit = this.creditRepository.findOne({
      where: {
        userEmail: email,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if(!credit) return this.creditRepository.save({ credits: 100, userEmail: email });

    return {
      status: 200,
      data: {
        credit
      },
    };
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
