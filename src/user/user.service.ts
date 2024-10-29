import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { Role } from './enum/user.enum';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findAll() {
    return 'find users';
  }

  async findOne(id: string) {
    return 'find user';
  }

  async create(email: string, password: string) {
    return await this.userRepository.save({ email, password });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async checkUserIsAdmin(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return user.role == Role.ADMIN;
  }
}
