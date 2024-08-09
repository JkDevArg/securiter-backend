import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Credit } from 'src/credits/entities/credit.entity';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { Store } from 'src/phone/entities/validate.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Credit)
    private readonly creditRepository: Repository<Credit>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findByEmailWithPassword(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'],
      relations: ['credits'],
    });
  }

  async findByEmailWithCredits(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['credits'],
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getMyStats(user: UserActiveInterface) {
    const result = await this.storeRepository.createQueryBuilder('store')
      .select([
        'COUNT(*) as totalServices',
        'SUM(CASE WHEN store.phone_number IS NOT NULL THEN 1 ELSE 0 END) as totalServicesPhone',
        'SUM(CASE WHEN store.url IS NOT NULL THEN 1 ELSE 0 END) as totalServicesUrl',
        'SUM(CASE WHEN store.email IS NOT NULL THEN 1 ELSE 0 END) as totalServicesEmail',
        'SUM(CASE WHEN store.proxy IS NOT NULL THEN 1 ELSE 0 END) as totalServicesProxy'
      ])
      .where('store.userEmail = :email', { email: user.email })
      .getRawOne();

    return {
      status: 200,
      data: {
        totalServices: Number(result.totalServices),
        totalServicesPhone: Number(result.totalServicesPhone),
        totalServicesUrl: Number(result.totalServicesUrl),
        totalServicesEmail: Number(result.totalServicesEmail),
        totalServicesProxy: Number(result.totalServicesProxy),
      },
    };
  }
}
