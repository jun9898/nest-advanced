import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { Role } from './enum/user.enum';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findAll(page: number, size: number) {
    return this.userRepository.find({
      skip: (page - 1) * size,
      take: size,
    });
  }

  async findOne(id: string) {
    return 'find user';
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async checkUserIsAdmin(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return user.role == Role.ADMIN;
  }

  async createBulk() {
    for (let i = 4; i < 10000; i++) {
      await this.userRepository.save({
        email: `nest${i}@nest.com`,
        password: 'Password1!',
        passwordConfirm: 'Password1!',
      });
    }
  }
}
